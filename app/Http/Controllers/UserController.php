<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function signup(REquest $request) {
        $input = $request->validate([
            'name' => 'required|min:3|max:10|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:4'
        ]);

        $user = User::create($input);
        return redirect('/')->with('success', "Your account was created!");
    }

    public function login(Request $request) {
        $input = $request->validate([
            'name' => 'required',
            'password' => 'required'
        ]);

        if (auth()->attempt(['name' => $input["name"], 'password' => $input['password']])) {
            // $request->session()->session_regenerate_id();

            return redirect('/main_page');
        }

        return redirect('/login')->with('error', 'Check your credentials');
    }

    public function logout(Request $request) {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // return response()->json(['success' => true]);
        return redirect('/login');
    }
}
