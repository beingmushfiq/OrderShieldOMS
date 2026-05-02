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

    /**
     * Update an existing product.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'sku'         => 'nullable|string|unique:products,sku,' . $id,
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'weight'      => 'nullable|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['sku']))         $updateData['sku']         = $validated['sku'];
        if (isset($validated['name']))        $updateData['name']        = $validated['name'];
        if (isset($validated['price']))       $updateData['price']       = $validated['price'];
        if (isset($validated['stock']))       $updateData['stock_count'] = $validated['stock'];
        if (isset($validated['weight']))      $updateData['weight_kg']   = $validated['weight'];
        if (isset($validated['category_id'])) {
            $updateData['category_id'] = $validated['category_id'];
            $updateData['category']    = Category::find($validated['category_id'])->name;
        }
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];

        $product->update($updateData);

        return response()->json($product);
    }

    /**
     * Remove a product.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
