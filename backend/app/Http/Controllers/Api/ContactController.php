<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Services\ContactService;

class ContactController extends Controller
{
    protected $contactService;

    public function __construct(ContactService $service)
    {
        $this->contactService = $service;
    }

    // POST /api/contact
    public function store(StoreContactRequest $request)
    {
        $data = $request->validated(); // <-- get validated data

        $message = $this->contactService->create($data);

        return response()->json($message, 201);
    }
}
