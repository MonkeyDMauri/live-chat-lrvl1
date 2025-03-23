<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ContactsController extends Controller
{
    public function getAllContacts() {
        $contacts = User::where('id', '!=', auth()->user()->id)->get();
    
        return response()->json(['success' => true, 'contacts' => $contacts]);
    }

    public function getSelectedContact(Request $request) {
        $input = $request->json()->all();

        $contact = User::where('name', $input['contactName'])->first();

        return response()->json(['success'=>true, 'contact'=> $contact]);
    }
}
