<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    /**
     * Get all settings.
     */
    public function all()
    {
        return response()->json(SystemSetting::all()->pluck('value', 'key'));
    }

    /**
     * Update bulk settings.
     */
    public function updateBulk(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            SystemSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(SystemSetting::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:system_settings,key',
            'value' => 'nullable|string',
        ]);

        $setting = SystemSetting::create($validated);
        return response()->json($setting);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SystemSetting $systemSetting)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
        ]);

        $systemSetting->update($validated);
        return response()->json($systemSetting);
    }
}
