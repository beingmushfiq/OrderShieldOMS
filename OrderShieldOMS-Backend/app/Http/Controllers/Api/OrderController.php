<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Traits\CacheableResponse;
use App\Traits\FraudDetection;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use CacheableResponse, FraudDetection;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transformed = $this->cacheResponse('orders_listing_all', ['orders'], 3600, function() {
            $orders = Order::with(['customer', 'items.product'])->latest()->get();

            return $orders->map(function ($order) {
                return [
                    'id' => $order->order_id,
                    'customer' => $order->customer->name,
                    'phone' => $order->customer->phone,
                    'amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'fraudScore' => $order->fraud_score,
                    'date' => $order->order_date->format('M d, Y'),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => (string) $item->product_id,
                            'name' => $item->product->name,
                            'price' => (float) $item->unit_price,
                            'quantity' => $item->quantity,
                            'weight' => (float) $item->product->weight_kg,
                        ];
                    })->values()->all(),
                ];
            })->toArray();
        });

        return response()->json($transformed);
    }

    public function alerts()
    {
        $orders = Order::with(['customer', 'items.product'])
            ->where('status', 'flagged')
            ->orWhere('fraud_score', '>=', 80)
            ->latest()
            ->get();

        return response()->json($orders->map(function ($order) {
            return [
                'id' => $order->order_id,
                'customer' => $order->customer->name,
                'email' => $order->customer->email,
                'phone' => $order->customer->phone,
                'amount' => (float) $order->total_amount,
                'status' => $order->status,
                'fraudScore' => $order->fraud_score,
                'date' => $order->order_date->format('M d, Y'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->unit_price,
                    ];
                })->values()->all(),
            ];
        }));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string',
            'items'            => 'required|array|min:1',
            'items.*.id'       => 'required|integer', // This is the product ID
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // 1. Find or create customer
        $customer = \App\Models\Customer::firstOrCreate(
            ['phone' => $validated['customer_phone']],
            [
                'name'             => $validated['customer_name'],
                'email'            => $validated['customer_email'],
                'customer_id'      => 'CUS-' . strtoupper(\Illuminate\Support\Str::random(6)),
                'location'         => $validated['customer_address'],

                'member_since'     => now(),
                'tier'             => 'Bronze',
                'fraud_risk_score' => rand(0, 20),
                'lifetime_value'   => 0,
            ]
        );

        // 2. Calculate total and create order
        $totalAmount = 0;
        $itemsToCreate = [];

        foreach ($validated['items'] as $itemData) {
            $product = \App\Models\Product::findOrFail($itemData['id']);
            $unitPrice = (float) $product->price;
            $lineTotal = $unitPrice * $itemData['quantity'];
            
            $totalAmount += $lineTotal;
            
            $itemsToCreate[] = [
                'product_id'  => $product->id,
                'quantity'    => $itemData['quantity'],
                'unit_price'  => $unitPrice,
                'total_price' => $lineTotal,
            ];
        }

        $fraudScore = $this->calculateFraudScore($customer, $totalAmount);

        $order = \App\Models\Order::create([
            'order_id'     => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'customer_id'  => $customer->id,
            'total_amount' => $totalAmount,
            'status'       => $fraudScore >= 80 ? 'flagged' : 'processing',
            'fraud_score'  => $fraudScore,
            'order_date'   => now(),
        ]);

        // 3. Create items and calculate weight
        $totalWeight = 0;
        foreach ($itemsToCreate as $item) {
            $item['order_id'] = $order->id;
            \App\Models\OrderItem::create($item);
            
            // Increment weight for shipping calculation
            $product = \App\Models\Product::find($item['product_id']);
            $totalWeight += ($product->weight_kg ?? 0) * $item['quantity'];

            // Decrement stock
            \App\Models\Product::where('id', $item['product_id'])->decrement('stock_count', $item['quantity']);
        }

        // 4. Calculate Shipping Charge (e.g., 60 base + 20 per kg)
        $shippingCharge = 60 + (max(0, floor($totalWeight)) * 20);

        // 5. Create Invoice automatically
        \App\Models\Invoice::create([
            'invoice_id' => 'INV-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'order_id' => $order->id,
            'amount' => $totalAmount,
            'shipping_charge' => $shippingCharge,
            'total_amount' => $totalAmount + $shippingCharge,
            'status' => 'pending',
            'issued_at' => now(),
            'due_at' => now()->addDays(7),
        ]);

        // Invalidate orders and invoices cache
        $this->invalidateCache(['orders', 'invoices']);

        return response()->json([
            'message'  => 'Order processed through security matrix',
            'order_id' => $order->order_id
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['customer', 'items.product', 'shipment.history', 'invoice'])
            ->where('order_id', $id)
            ->firstOrFail();

        return response()->json([
            'id' => $order->order_id,
            'customer' => $order->customer->name,
            'phone' => $order->customer->phone,
            'amount' => (float) $order->total_amount,
            'status' => $order->status,
            'fraudScore' => $order->fraud_score,
            'date' => $order->order_date->format('M d, Y'),
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => (string) $item->product_id,
                    'name' => $item->product->name,
                    'price' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'weight' => (float) $item->product->weight_kg,
                ];
            })->values()->all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::where('order_id', $id)->with('customer')->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|string|in:processing,completed,shipped,flagged,cancelled',
            'total_amount' => 'sometimes|numeric|min:0',
            'customer_name' => 'sometimes|string|max:255',
            'customer_phone' => 'sometimes|string|max:20',
        ]);

        if (isset($validated['status'])) {
            $order->status = $validated['status'];
            
            if ($validated['status'] === 'shipped' && !$order->shipment) {
                // Find an active courier
                $courier = \App\Models\Courier::where('is_active', true)->first();
                
                $order->shipment()->create([
                    'shipment_id' => 'SHIP-' . strtoupper(\Illuminate\Support\Str::random(8)),
                    'status' => 'pending',
                    'current_location' => 'Processing Center',
                    'estimated_delivery_at' => now()->addDays(3),
                    // In a real app, we'd store the courier_id here too
                ]);

                // Simulate API call to Courier
                if ($courier) {
                    \Illuminate\Support\Facades\Log::info("Order {$order->order_id} sent to courier: {$courier->name} via {$courier->api_url}");
                }
            }
        }

        if (isset($validated['total_amount'])) {
            $order->total_amount = $validated['total_amount'];
        }

        if (isset($validated['customer_name'])) {
            $order->customer->name = $validated['customer_name'];
            $order->customer->save();
        }

        if (isset($validated['customer_phone'])) {
            $order->customer->phone = $validated['customer_phone'];
            $order->customer->save();
        }

        $order->save();
        $this->invalidateCache(['orders']);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => [
                'id' => $order->order_id,
                'customer' => $order->customer->name,
                'phone' => $order->customer->phone,
                'amount' => (float) $order->total_amount,
                'status' => $order->status,
                'fraudScore' => $order->fraud_score,
                'date' => $order->order_date ? $order->order_date->format('M d, Y') : now()->format('M d, Y'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->unit_price,
                    ];
                })->values()->all(),
            ]
        ]);
    }
}
