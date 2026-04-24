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
                'role' => 'admin', // Mock role for now
                'avatar' => 'https://i.pravatar.cc/150?u=' . $user->id
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Secure session terminated']);
    }
}
