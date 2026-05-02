<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes here are prefixed with /api by Laravel automatically.
| Auth routes are public. Everything else requires a valid Sanctum token.
*/

// ── Public: Authentication ──────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ── Protected: Requires Sanctum Bearer Token ────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());
    Route::patch('/user/theme', [AuthController::class, 'updateTheme']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);

    // Dashboard summary stats
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Orders — full CRUD
    Route::get('/orders',        [OrderController::class, 'index']);
    Route::post('/orders',       [OrderController::class, 'store']);
    Route::get('/orders/{id}',   [OrderController::class, 'show']);
    Route::put('/orders/{id}',   [OrderController::class, 'update']);
    Route::get('/alerts',        [OrderController::class, 'alerts']);

    // Customers
    Route::get('/customers',     [CustomerController::class, 'index']);
    Route::get('/customers/{id}',[CustomerController::class, 'show']);
    Route::put('/customers/{id}',[CustomerController::class, 'update']);

    // Products
    Route::get('/products',      [ProductController::class, 'index']);
    Route::post('/products',     [ProductController::class, 'store']);
    Route::put('/products/{id}',    [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Invoices
    Route::get('/invoices',      [InvoiceController::class, 'index']);
    Route::post('/invoices/{id}/send', [InvoiceController::class, 'send']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);

    // Categories
    Route::get('/categories',    [CategoryController::class, 'index']);
    Route::post('/categories',   [CategoryController::class, 'store']);

    // Shipments / Tracking
    Route::get('/shipments',     [ShipmentController::class, 'index']);
    Route::get('/shipments/{id}',[ShipmentController::class, 'show']);

    // Couriers
    Route::apiResource('couriers', CourierController::class);

    // System Settings
    Route::get('settings/all', [SystemSettingController::class, 'all']);
    Route::post('settings/bulk', [SystemSettingController::class, 'updateBulk']);
    Route::apiResource('settings', SystemSettingController::class)->only(['index', 'store', 'update']);
});
