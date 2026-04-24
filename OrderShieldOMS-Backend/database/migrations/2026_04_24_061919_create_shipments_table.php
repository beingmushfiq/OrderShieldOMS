<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('shipment_id')->unique(); // SHIP-XXXXX
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'in_transit', 'out_for_delivery', 'delivered', 'flagged', 'returned'])->default('pending');
            $table->string('current_location')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });

        Schema::create('shipment_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained()->onDelete('cascade');
            $table->string('location');
            $table->string('status');
            $table->text('message')->nullable();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_histories');
        Schema::dropIfExists('shipments');
    }
};
