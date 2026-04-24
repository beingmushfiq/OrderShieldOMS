<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Models\Category;

class ProductController extends Controller
{
    /**
     * Return all products formatted for the frontend catalog.
     */
    public function index(): JsonResponse
    {
        $products = Product::all()->map(fn($p) => [
            'id'          => $p->id,
            'sku'         => $p->sku,
            'name'        => $p->name,
            'description' => $p->description,
            'price'       => (float) $p->price,
            'stock'       => $p->stock_count,
            'weight'      => (float) $p->weight_kg,
            'category_id' => $p->category_id,
            'category'    => $p->category,
        ]);

        return response()->json($products);
    }

    /**
     * Store a new product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sku'         => 'nullable|string|unique:products',
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'weight'      => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $product = Product::create([
            'sku'         => $validated['sku'] ?? 'B-SENT-' . strtoupper(Str::random(6)),
            'name'        => $validated['name'],
            'price'       => $validated['price'],
            'stock_count' => $validated['stock'],
            'weight_kg'   => $validated['weight'] ?? 1.0,
            'category_id' => $validated['category_id'],
            'description' => $validated['description'] ?? '',
            'category'    => Category::find($validated['category_id'])->name,
        ]);

        return response()->json($product, 201);
    }
}
