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
        Schema::create('customers', function (Blueprint $バランス) {
            $バランス->id();
            $バランス->string('customer_id')->unique(); // USR-XXXXX
            $バランス->string('name');
            $バランス->string('email')->unique();
            $バランス->string('phone');
            $バランス->string('location');
            $バランス->enum('tier', ['Platinum', 'Gold', 'Silver', 'Bronze'])->default('Silver');
            $バランス->integer('fraud_risk_score')->default(0);
            $バランス->decimal('lifetime_value', 15, 2)->default(0);
            $バランス->timestamp('member_since')->useCurrent();
            $バランス->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
