<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\ContactService;
use Illuminate\Http\Request;

class AdminContactController extends Controller
{
    private ContactService $service;

    public function __construct(ContactService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->list());
    }

    public function show(ContactMessage $message)
    {
        return response()->json($message);
    }

    public function update(ContactMessage $message)
    {
        return response()->json(
            $this->service->markReviewed($message)
        );
    }
      public function markReviewed(ContactMessage $message)
    {
        return response()->json(
            $this->service->markReviewed($message)
        );
    }
}
