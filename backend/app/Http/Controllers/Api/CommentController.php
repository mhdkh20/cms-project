<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Services\CommentService;

class CommentController extends Controller
{
    protected $service;

    public function __construct(CommentService $service)
    {
        $this->service = $service;
    }

    public function store(StoreCommentRequest $request, int $articleId)
    {
        $data = $request->validated();
        $data['article_id'] = $articleId;

        $comment = $this->service->create($data);

        return response()->json($comment, 201);
    }
}
