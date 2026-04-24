<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DashboardController;
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

    // Dashboard summary stats
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Orders — full CRUD
    Route::get('/orders',        [OrderController::class, 'index']);
    Route::post('/orders',       [OrderController::class, 'store']);
    Route::get('/orders/{id}',   [OrderController::class, 'show']);
    Route::put('/orders/{id}',   [OrderController::class, 'update']);

    // Customers
    Route::get('/customers',     [CustomerController::class, 'index']);
    Route::get('/customers/{id}',[CustomerController::class, 'show']);

    // Products
    Route::get('/products',      [ProductController::class, 'index']);
    Route::post('/products',     [ProductController::class, 'store']);

    // Categories
    Route::get('/categories',    [CategoryController::class, 'index']);
    Route::post('/categories',   [CategoryController::class, 'store']);
});
