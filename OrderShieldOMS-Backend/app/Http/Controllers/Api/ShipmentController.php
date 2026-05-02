<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function index()
    {
        $shipments = Shipment::with(['order.customer', 'history'])->latest()->get();

        return response()->json($shipments->map(function ($shipment) {
            return [
                'id' => $shipment->shipment_id,
                'name' => $shipment->order->customer->name,
                'status' => $shipment->status, // Map to pending, in-transit, delivered
                'eta' => $shipment->estimated_delivery_at ? $shipment->estimated_delivery_at->format('M d, Y') : 'N/A',
                'courier' => 'Standard Courier', // In real app, fetch from courier_id
                'location' => $shipment->current_location,
                'lastUpdate' => $shipment->updated_at->format('M d, Y H:i'),
                'order_id' => $shipment->order->order_id,
                'history' => $shipment->history->map(function($h) {
                    return [
                        'status' => $h->status,
                        'location' => $h->location,
                        'timestamp' => $h->created_at->format('M d, Y H:i'),
                    ];
                })
            ];
        }));
    }

    public function show($id)
    {
        $shipment = Shipment::where('shipment_id', $id)->with(['order.customer', 'history'])->firstOrFail();
        return response()->json($shipment);
    }
}
