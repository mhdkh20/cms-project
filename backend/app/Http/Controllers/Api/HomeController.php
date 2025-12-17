<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __construct(private ArticleService $service) {}

    public function index(Request $request)
    {
        return response()->json(
            $this->service->listPublic($request->query())
        );
    }
}