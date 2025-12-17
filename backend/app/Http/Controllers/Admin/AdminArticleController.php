<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\Request;


class AdminArticleController extends Controller
{
    private ArticleService $service;

    public function __construct(ArticleService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return response()->json(
            $this->service->list($request->all())
        );
    }

    public function store(StoreArticleRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $article = $this->service->create($data);

        return response()->json($article, 201);
    }

    public function update(UpdateArticleRequest $request, Article $article)
    {
        $updated = $this->service->update($article, $request->validated());
        return response()->json($updated);
    }

    public function destroy(Article $article)
    {
        $this->service->delete($article);
        return response()->json(['message' => 'Deleted']);
    }

    public function togglePublish(Article $article)
    {
        return response()->json(
            $this->service->togglePublish($article)
        );
    }

    public function show(Article $article)
{
    return response()->json(
        $article->load(['author', 'categories'])
    );
}

}
