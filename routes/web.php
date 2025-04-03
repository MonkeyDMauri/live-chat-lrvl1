<?php

use App\Http\Controllers\ContactsController;
use App\Http\Controllers\MessagesController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('signup_login.signup');
});

Route::get('/login', function () {
    return view('signup_login.login');
});

Route::get('/main_page', function() {
    return view('main_page/main_page');
});

Route::post('/signup', [UserController::class, 'signup']);
Route::post('/login', [UserController::class, 'login']);

//route to trigger logout request.
Route::post('/logout', [UserController::class, 'logout']);

//Route to get all contacts to then display em or do smthing with them.
Route::get('/get-all-contacts', [ContactsController::class, 'getAllContacts']);

// Get selected contact info;
Route::post('/get-selected-contact', [ContactsController::class, 'getSelectedContact']);

//save messages to messages table.
Route::post('/save-message', [MessagesController::class, 'saveMessage']);

Route::post('/get-messages', [MessagesController::class, 'getAllMessages']);

//update user info routes.
Route::post('/update-user-info', [UserController::class, "updateUserInfo"]);