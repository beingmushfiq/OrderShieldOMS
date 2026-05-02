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
        $alertCount      = Order::where('fraud_score', '>=', 80)->orWhere('status', 'flagged')->count();
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

        $recentActivities = collect();

        Order::with('customer')->latest('created_at')->limit(10)->get()->each(function($order) use ($recentActivities) {
            $recentActivities->push([
                'type' => 'order',
                'message' => 'Order #' . $order->order_id . ' placed by ' . ($order->customer->name ?? 'Unknown'),
                'time' => $order->created_at->diffForHumans(),
                'sort_time' => $order->created_at->timestamp
            ]);
            
            if ($order->fraud_score >= 70 || $order->status === 'flagged') {
                $recentActivities->push([
                    'type' => 'fraud',
                    'message' => 'Fraud alert triggered for Order #' . $order->order_id,
                    'time' => $order->created_at->diffForHumans(),
                    'sort_time' => $order->created_at->timestamp + 1
                ]);
            }
            
            if ($order->status === 'shipped' || $order->tracking_number) {
                $recentActivities->push([
                    'type' => 'shipping',
                    'message' => 'Order ' . ($order->tracking_number ? '#' . $order->tracking_number : '#' . $order->order_id) . ' is in shipping',
                    'time' => $order->updated_at->diffForHumans(),
                    'sort_time' => $order->updated_at->timestamp
                ]);
            }
        });

        Customer::latest('created_at')->limit(5)->get()->each(function($customer) use ($recentActivities) {
            $recentActivities->push([
                'type' => 'system',
                'message' => 'New customer registered: ' . $customer->name,
                'time' => $customer->created_at->diffForHumans(),
                'sort_time' => $customer->created_at->timestamp
            ]);
        });

        $activityLog = $recentActivities->sortByDesc('sort_time')->take(5)->values()->map(function($item) {
            unset($item['sort_time']);
            return $item;
        });

        return response()->json([
            'totalRevenue'   => (float) $totalRevenue,
            'totalOrders'    => $totalOrders,
            'flaggedOrders'  => $flaggedOrders,
            'totalCustomers' => $totalCustomers,
            'totalProducts'  => $totalProducts,
            'recentOrders'   => $recentOrders,
            'activityLog'    => $activityLog,
            'alertCount'     => $alertCount,
        ]);
    }
}
