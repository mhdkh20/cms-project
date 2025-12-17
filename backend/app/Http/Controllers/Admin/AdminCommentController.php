<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\Request;

class AdminCommentController extends Controller
{
    private CommentService $service;

    public function __construct(CommentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return response()->json(
            $this->service->list($request->all())
        );
    }

    public function update(Comment $comment)
    {
        return response()->json(
            $this->service->approve($comment)
        );
    }
public function approve(Comment $comment)
    {
        return response()->json(
            $this->service->approve($comment)
        );
    }
    public function destroy(Comment $comment)
    {
        $this->service->delete($comment);
        return response()->json(['message'=> 'Deleted']);
    }
}
