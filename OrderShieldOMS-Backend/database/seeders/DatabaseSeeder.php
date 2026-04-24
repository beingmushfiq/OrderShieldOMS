<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\ShipmentHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Shihab Shoron',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        // Products
        $products = [
            ['sku' => 'B-SENT-8821', 'name' => 'Tin Goyenda Collector Set', 'price' => 1299, 'stock_count' => 50, 'weight_kg' => 0.450, 'category' => 'Books'],
            ['sku' => 'B-SENT-0044', 'name' => 'Shawshank Redemption (Hardcover)', 'price' => 447, 'stock_count' => 120, 'weight_kg' => 0.120, 'category' => 'Books'],
            ['sku' => 'B-SENT-1190', 'name' => 'Harry Potter Special Edition', 'price' => 1390, 'stock_count' => 30, 'weight_kg' => 0.680, 'category' => 'Books'],
            ['sku' => 'B-SENT-5501', 'name' => 'The Witcher: The Last Wish', 'price' => 599, 'stock_count' => 85, 'weight_kg' => 0.010, 'category' => 'Books'],
            ['sku' => 'B-SENT-7733', 'name' => 'The Alchemist: 25th Anniversary', 'price' => 1120, 'stock_count' => 40, 'weight_kg' => 0.200, 'category' => 'Books'],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }

        // Customers
        $customer = Customer::create([
            'customer_id' => 'USR-88220',
            'name' => 'Shihab Shoron',
            'email' => 'shihab@ordershield.com',
            'phone' => '01711223344',
            'location' => 'Dhaka, Bangladesh',
            'tier' => 'Platinum',
            'fraud_risk_score' => 12,
            'lifetime_value' => 48250,
            'member_since' => now()->subMonths(6),
        ]);

        // Order
        $order = Order::create([
            'order_id' => 'ORD-88219',
            'customer_id' => $customer->id,
            'total_amount' => 2499,
            'status' => 'processing',
            'fraud_score' => 12,
            'tracking_number' => 'SHIP-88219',
            'order_date' => now(),
        ]);

        // Order Items
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => 1, // Tin Goyenda
            'quantity' => 1,
            'unit_price' => 2499,
            'total_price' => 2499,
        ]);

        // Invoice
        Invoice::create([
            'invoice_id' => 'INV-88219',
            'order_id' => $order->id,
            'amount' => 2499,
            'tax_amount' => 0,
            'total_amount' => 2499,
            'status' => 'paid',
            'issued_at' => now(),
            'due_at' => now()->addDays(7),
        ]);

        // Shipment
        $shipment = Shipment::create([
            'shipment_id' => 'SHIP-88219',
            'order_id' => $order->id,
            'status' => 'in_transit',
            'current_location' => 'Dhaka Sorting Hub',
            'estimated_delivery_at' => now()->addDays(2),
        ]);

        ShipmentHistory::create([
            'shipment_id' => $shipment->id,
            'location' => 'Warehousing Facility',
            'status' => 'Package Dispatched',
            'message' => 'Handover to courier partner complete.',
            'recorded_at' => now()->subHours(5),
        ]);
    }
}
