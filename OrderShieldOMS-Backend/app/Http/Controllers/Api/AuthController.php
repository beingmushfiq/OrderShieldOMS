<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        \Log::info('Login Attempt Pre-Validation', $request->all());

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        \Log::info('Login Attempt', $request->all());

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'debug' => true,
                'email_received' => $request->email,
                'password_received' => $request->password,
                'user_found' => $user ? true : false,
            ], 422);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'theme' => $user->theme,
                'phone' => $user->phone,
                'company' => $user->company,
                'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40'
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Secure session terminated']);
    }

    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:light,dark',
        ]);

        $user = $request->user();
        $user->theme = $request->theme;
        $user->save();

        return response()->json(['message' => 'Theme updated successfully', 'theme' => $user->theme]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
        ]);

        $user->update($request->only(['name', 'email', 'phone', 'company']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company' => $user->company,
                'role' => $user->role,
                'avatar' => 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40'
            ]
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}

