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
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Mock logic for creating order and calculating fraud score
        // In a real app, this would involve a Service class
        
        return response()->json(['message' => 'Order processed through security matrix'], 201);
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
