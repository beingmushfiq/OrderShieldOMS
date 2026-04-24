<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_id',
        'total_amount',
        'status',
        'fraud_score',
        'tracking_number',
        'order_date',
    ];

    protected $casts = [
        'order_date'   => 'datetime',
        'total_amount' => 'float',
        'fraud_score'  => 'integer',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class);
    }
}
