<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'order_id',
        'status',
        'current_location',
        'estimated_delivery_at',
        'shipped_at',
        'delivered_at',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(ShipmentHistory::class);
    }
}
