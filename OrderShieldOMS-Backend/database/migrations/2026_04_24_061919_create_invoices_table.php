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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_id')->unique(); // INV-XXXXX
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->enum('status', ['paid', 'pending', 'overdue'])->default('pending');
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamp('due_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
