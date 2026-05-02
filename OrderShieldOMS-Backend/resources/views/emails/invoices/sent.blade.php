<x-mail::message>
# Invoice #{{ $invoice->invoice_id }}

Hello {{ $customer->name }},

Thank you for your business. Your invoice for order #{{ $order->order_id }} is ready.

<x-mail::panel>
**Total Amount Due: ৳ {{ number_format($invoice->total_amount, 2) }}**  
**Due Date: {{ \Illuminate\Support\Carbon::parse($invoice->due_at)->format('M d, Y') }}**
</x-mail::panel>

<x-mail::table>
| Description | Qty | Price | Total |
| :--- | :---: | :---: | :---: |
@foreach($order->items as $item)
| {{ $item->product->name }} | {{ $item->quantity }} | ৳{{ number_format($item->unit_price, 2) }} | ৳{{ number_format($item->total_price, 2) }} |
@endforeach
</x-mail::table>

<x-mail::button :url="config('app.url') . '/invoices/' . $invoice->invoice_id">
View Full Invoice
</x-mail::button>

If you have any questions regarding this invoice, please reach out to our support team.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
