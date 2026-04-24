<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'order_id',
        'amount',
        'tax_amount',
        'total_amount',
        'status',
        'issued_at',
        'due_at',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
