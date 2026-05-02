<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Courier;
use Illuminate\Http\Request;

class CourierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Courier::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'api_url' => 'nullable|string',
            'api_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $courier = Courier::create($validated);
        return response()->json($courier);
    }

    /**
     * Display the specified resource.
     */
    public function show(Courier $courier)
    {
        return response()->json($courier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Courier $courier)
    {
        $validated = $request->validate([
            'name' => 'string',
            'api_url' => 'nullable|string',
            'api_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $courier->update($validated);
        return response()->json($courier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Courier $courier)
    {
        $courier->delete();
        return response()->json(['message' => 'Courier deleted']);
    }
}
