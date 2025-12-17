<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Http\Services\CommentService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(private ArticleService $service) {}

    public function index(Request $request)
    {
        return response()->json(
            $this->service->listPublic($request->query())
        );
    }

    public function show($id)
    {
        return response()->json(
            $this->service->findPublicById($id)
        );
    }

    public function related($id)
    {
        return response()->json(
            $this->service->related($id)
        );
    }
}
