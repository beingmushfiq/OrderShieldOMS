<?php

namespace App\Traits;

use App\Models\Customer;
use App\Models\Order;
use Carbon\Carbon;

trait FraudDetection
{
    /**
     * Calculate a fraud risk score (0-100) for a new order.
     */
    protected function calculateFraudScore(Customer $customer, float $totalAmount): int
    {
        $enabled = \App\Models\SystemSetting::where('key', 'fraud_enabled')->first()?->value ?? '1';
        if ($enabled === '0') {
            return 0;
        }

        $score = 5; // Base score

        // 1. New Customer Check
        $isNew = Carbon::parse($customer->member_since)->diffInHours(now()) < 24;
        if ($isNew) {
            $score += 15;
        }

        // 2. High Value Transaction Check
        if ($totalAmount > 20000) {
            $score += 40;
        } elseif ($totalAmount > 10000) {
            $score += 20;
        } elseif ($totalAmount > 5000) {
            $score += 10;
        }

        // 3. Frequency Check (Velocity)
        $recentOrdersCount = Order::where('customer_id', $customer->id)
            ->where('created_at', '>=', now()->subHour())
            ->count();
        
        if ($recentOrdersCount >= 3) {
            $score += 45;
        } elseif ($recentOrdersCount >= 1) {
            $score += 10;
        }

        // 4. Inherited Customer Risk
        $score += ($customer->fraud_risk_score / 2);

        // 5. Large Quantity Check
        // (Optional: could check items quantity if passed)

        return (int) min(100, $score);
    }

    /**
     * Determine the risk level based on the score.
     */
    protected function getRiskLevel(int $score): string
    {
        if ($score >= 80) return 'High';
        if ($score >= 40) return 'Medium';
        return 'Low';
    }
}
