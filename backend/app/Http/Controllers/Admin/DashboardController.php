<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Services\CategoryService;
use App\Services\CommentService;
use App\Services\ContactService;

class DashboardController extends Controller
{
    private ArticleService $articleService;
    private CategoryService $categoryService;
    private CommentService $commentService;
    private ContactService $contactService;

    public function __construct(
        ArticleService $articleService,
        CategoryService $categoryService,
        CommentService $commentService,
        ContactService $contactService
    ) {
        $this->articleService = $articleService;
        $this->categoryService = $categoryService;
        $this->commentService = $commentService;
        $this->contactService = $contactService;
    }

   public function index()
{
    $totalArticles = $this->articleService->countAll();
    $totalCategories = $this->categoryService->countAll();
    $pendingComments = $this->commentService->countPending();
    $totalMessages = $this->contactService->countAll();

    return response()->json([
        'total_articles' => $totalArticles,
        'total_categories' => $totalCategories,
        'pending_comments' => $pendingComments,
        'total_messages' => $totalMessages,
    ]);
}
}
