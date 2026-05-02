<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Mail\InvoiceMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;

use App\Traits\CacheableResponse;

class InvoiceController extends Controller
{
    use CacheableResponse;

    /**
     * Display a listing of invoices.
     */
    public function index(): JsonResponse
    {
        $invoices = $this->cacheResponse('invoices_listing_all', ['invoices'], 3600, function() {
            $invoices = Invoice::with(['order.customer', 'order.items.product'])->latest()->get();

            return $invoices->map(function ($invoice) {
                return [
                    'id' => $invoice->invoice_id,
                    'orderId' => $invoice->order->order_id,
                    'customer' => $invoice->order->customer->name,
                    'email' => $invoice->order->customer->email,
                    'amount' => (float) $invoice->amount,
                    'shippingCharge' => (float) $invoice->shipping_charge,
                    'total' => (float) $invoice->total_amount,
                    'status' => $invoice->status,
                    'issuedDate' => \Illuminate\Support\Carbon::parse($invoice->issued_at)->format('M d, Y'),
                    'dueDate' => \Illuminate\Support\Carbon::parse($invoice->due_at)->format('M d, Y'),
                    'items' => $invoice->order->items->values()->map(function ($item) {
                        return [
                            'description' => $item->product->name,
                            'quantity' => $item->quantity,
                            'unitPrice' => (float) $item->unit_price,
                            'total' => (float) $item->total_price,
                        ];
                    })->all(),
                ];
            })->toArray();
        });

        return response()->json($invoices);
    }

    /**
     * Send an invoice to the customer's email.
     */
    public function send($id): JsonResponse
    {
        $invoice = Invoice::where('invoice_id', $id)->with(['order.customer', 'order.items.product'])->firstOrFail();

        if (!$invoice->order->customer->email) {
            return response()->json(['message' => 'Customer does not have an email address.'], 422);
        }

        Mail::to($invoice->order->customer->email)->send(new InvoiceMail($invoice));

        return response()->json(['message' => 'Invoice sent successfully to ' . $invoice->order->customer->email]);
    }

    /**
     * Update an invoice.
     */
    public function update(\Illuminate\Http\Request $request, $id): JsonResponse
    {
        $invoice = Invoice::where('invoice_id', $id)->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|string|in:paid,pending,overdue',
            'due_at' => 'sometimes|date',
            'shipping_charge' => 'sometimes|numeric|min:0',
        ]);

        if (isset($validated['shipping_charge'])) {
            $invoice->shipping_charge = $validated['shipping_charge'];
            // Re-calculate total
            $invoice->total_amount = $invoice->amount + $invoice->shipping_charge;
        }

        if (isset($validated['status'])) {
            $invoice->status = $validated['status'];
        }

        if (isset($validated['due_at'])) {
            $invoice->due_at = $validated['due_at'];
        }

        $invoice->save();

        $this->invalidateCache(['invoices']);

        return response()->json([
            'message' => 'Invoice updated successfully',
            'invoice' => $invoice
        ]);
    }
}
