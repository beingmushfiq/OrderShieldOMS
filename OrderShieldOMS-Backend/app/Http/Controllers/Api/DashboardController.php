<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return aggregated stats for the Dashboard overview cards.
     */
    public function index(): JsonResponse
    {
        $totalRevenue    = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $totalOrders     = Order::count();
        $flaggedOrders   = Order::where('fraud_score', '>=', 70)->orWhere('status', 'flagged')->count();
        $totalCustomers  = Customer::count();
        $totalProducts   = Product::count();
        $recentOrders    = Order::with('customer')
            ->latest('order_date')
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'         => $o->order_id,
                'customer'   => $o->customer?->name,
                'amount'     => (float) $o->total_amount,
                'status'     => $o->status,
                'fraudScore' => $o->fraud_score,
                'date'       => $o->order_date?->format('M d, Y'),
            ]);

        return response()->json([
            'totalRevenue'   => (float) $totalRevenue,
            'totalOrders'    => $totalOrders,
            'flaggedOrders'  => $flaggedOrders,
            'totalCustomers' => $totalCustomers,
            'totalProducts'  => $totalProducts,
            'recentOrders'   => $recentOrders,
        ]);
    }
}
