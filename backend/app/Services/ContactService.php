<?php

namespace App\Services;

use App\Models\ContactMessage;

class ContactService
{
    public function create(array $data)
    {
        return ContactMessage::create($data);
    }

    public function list()
    {
        return ContactMessage::latest()->paginate(5);
    }

    public function markReviewed(ContactMessage $msg)
    {
        $msg->reviewed = true;
        $msg->save();

        return $msg;
    }
    public function countAll(): int
{
    return ContactMessage::count();
}

}
