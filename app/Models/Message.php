<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['message', 'file_path', 'sender_id', 'receiver_id', 'deleted'];

    public function getFormattedDate() {
        return $this->created_at->format('Y h:s A');
    }
}
