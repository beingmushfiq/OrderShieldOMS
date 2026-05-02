<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Traits\CacheableResponse;

class CustomerController extends Controller
{
    use CacheableResponse;

    /**
     * Return a paginated list of all customers with their order stats.
     */
    public function index(): JsonResponse
    {
        $customers = $this->cacheResponse('customers_listing_all', ['customers'], 3600, function() {
            return Customer::withCount('orders')
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
                    'lifetimeValue'   => (float) ($c->orders_sum_total_amount ?? 0),
                    'totalOrders'     => $c->orders_count,
                    'memberSince'     => $c->member_since ? \Illuminate\Support\Carbon::parse($c->member_since)->format('M Y') : null,
                ])->toArray();
        });

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

    /**
     * Update customer information or flag for fraud.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::where('customer_id', $id)->firstOrFail();

        $validated = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'email'          => 'sometimes|email|max:255',
            'phone'          => 'sometimes|string|max:20',
            'location'       => 'sometimes|string|max:255',
            'tier'           => 'sometimes|string|max:50',
            'fraudRiskScore' => 'sometimes|integer|min:0|max:100',
        ]);

        if (isset($validated['fraudRiskScore'])) {
            $customer->fraud_risk_score = $validated['fraudRiskScore'];
        }

        $customer->update(collect($validated)->except('fraudRiskScore')->toArray());

        $this->invalidateCache(['customers']);

        return response()->json($customer);
    }
}
