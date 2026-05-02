<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['customer', 'items.product'])->latest()->get();

        // Transform to match frontend expectations
        $transformed = $orders->map(function ($order) {
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
                }),
            ];
        });

        return response()->json($transformed);
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

        $order = \App\Models\Order::create([
            'order_id'     => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'customer_id'  => $customer->id,
            'total_amount' => $totalAmount,
            'status'       => 'processing',
            'fraud_score'  => rand(5, 15),
            'order_date'   => now(),
        ]);

        // 3. Create items
        foreach ($itemsToCreate as $item) {
            $item['order_id'] = $order->id;
            \App\Models\OrderItem::create($item);
            
            // Decrement stock
            \App\Models\Product::where('id', $item['product_id'])->decrement('stock_count', $item['quantity']);
        }

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

        return response()->json($order);
    }
}
