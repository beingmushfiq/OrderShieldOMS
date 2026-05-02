<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait CacheableResponse
{
    /**
     * Cache the result of a callback with tags.
     *
     * @param string $key
     * @param array $tags
     * @param int $ttl Seconds
     * @param callable $callback
     * @return mixed
     */
    protected function cacheResponse(string $key, array $tags, int $ttl, callable $callback)
    {
        // Use database driver fallback if Redis tags are not available
        // Note: Laravel's 'database' or 'file' cache drivers do not support tagging.
        // We assume Redis/Memcached is used for this production-grade feature.
        
        if (config('cache.default') === 'redis' || config('cache.default') === 'memcached') {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        }

        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Invalidate cache tags.
     *
     * @param array $tags
     * @return void
     */
    protected function invalidateCache(array $tags)
    {
        if (config('cache.default') === 'redis' || config('cache.default') === 'memcached' || config('cache.store') === 'redis' || config('cache.store') === 'memcached') {
            Cache::tags($tags)->flush();
        } else {
            // Manual fallback for database/file drivers that don't support tagging
            if (in_array('orders', $tags)) {
                Cache::forget('orders_listing_all');
            }
            if (in_array('invoices', $tags)) {
                Cache::forget('invoices_listing_all');
            }
            if (in_array('customers', $tags)) {
                Cache::forget('customers_listing_all');
            }
        }
    }
}
