<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
    public function saveMessage(Request $request) {
        $message = $request['message'];
        $sender = auth()->user()->id;
        $receiver = $request['receiver_id'];

        Message::create([
            'message' => $message,
            'sender_id' => $sender,
            'receiver_id' => $receiver
        ]);

        return response()->json(['success' => true, 'message' => $receiver]);

    }

    public function getAllMessages(Request $request) {
        $sender = auth()->user()->id;
        $receiver = $request['receiver'];
        
        $messages = Message::where(function ($query) use ($sender, $receiver) {
            $query->where('sender_id', $sender)
                  ->where('receiver_id', $receiver);
        })
        ->orWhere(function ($query) use ($sender, $receiver) {
            $query->where('sender_id', $receiver)
                  ->where('receiver_id', $sender);
        })
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($messages) {
            return [
                'id' => $messages->id,
                'message' => $messages->message,
                'sender_id' => $messages->sender_id,
                'receiver_id' => $messages->receiver_id,
                'created_at' => $messages->getFormattedDate()
            ];
        });


        return response()->json(['success'=>true, 'messages' => $messages]);
    }
}


