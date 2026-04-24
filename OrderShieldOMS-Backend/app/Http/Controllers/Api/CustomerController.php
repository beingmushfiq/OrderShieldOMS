<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    /**
     * Return a paginated list of all customers with their order stats.
     */
    public function index(): JsonResponse
    {
        $customers = Customer::withCount('orders')
            ->withSum('orders', 'total_amount')
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id'              => $c->customer_id,
                'name'            => $c->name,
                'email'           => $c->email,
                'phone'           => $c->phone,
                'location'        => $c->location,
                'tier'            => $c->tier,
                'fraudRiskScore'  => $c->fraud_risk_score,
                'lifetimeValue'   => (float) $c->lifetime_value,
                'totalOrders'     => $c->orders_count,
                'memberSince'     => $c->member_since?->format('M Y'),
            ]);

        return response()->json($customers);
    }

    /**
     * Return a single customer with their full order history.
     */
    public function show(string $id): JsonResponse
    {
        $customer = Customer::where('customer_id', $id)
            ->with(['orders' => fn($q) => $q->latest()->limit(10)])
            ->firstOrFail();

        return response()->json($customer);
    }
}
