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
        'shipping_charge',
        'total_amount',
        'status',
        'issued_at',
        'due_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'due_at'    => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
