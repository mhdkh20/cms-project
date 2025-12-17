<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleService
{
    /* ========= ADMIN ========= */

    public function list(array $filters)
    {
        return Article::with(['author', 'categories'])
            ->when($filters['q'] ?? null, fn ($q, $v) =>
                $q->where('title', 'like', "%$v%")
            )
            ->when($filters['status'] ?? null, fn ($q, $v) =>
                $q->where('status', $v)
            )
            ->latest()
            ->paginate($filters['per_page'] ?? 5);
    }

    public function create(array $data)
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $data['status'] = $data['status'] ?? 'draft';

        if (!empty($data['image'])) {
            $data['image'] = $data['image']->store('articles', 'public');
        }

        $article = Article::create($data);

        if (!empty($data['categories'])) {
            $article->categories()->sync($data['categories']);
        }

        return $article;
    }

   public function update(Article $article, array $data)
{
    // Check if a new file was actually uploaded
    if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
        // Delete old image if it exists
        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }
        // Store new image
        $data['image'] = $data['image']->store('articles', 'public');
    } else {
        // Remove image from data so it doesn't overwrite with null 
        // if no new file was selected
        unset($data['image']);
    }

    if (isset($data['title'])) {
        $data['slug'] = Str::slug($data['title']);
    }

    $article->update($data);

    if (isset($data['categories'])) {
        $article->categories()->sync($data['categories']);
    }

    return $article->load('categories'); // Load relations for the response
}

    public function delete(Article $article)
    {
        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();
    }

    public function togglePublish(Article $article)
    {
        $article->status = $article->status === 'published'
            ? 'draft'
            : 'published';

        $article->save();

        return $article;
    }

    /* ========= PUBLIC ========= */

    public function listPublic(array $filters)
    {
        return Article::where('status', 'published')
            ->with(['author', 'categories'])
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findPublicById(int $id)
    {
        return Article::where('id', $id)
            ->where('status', 'published')
            ->with(['author', 'categories', 'comments' => function ($q) {
                $q->where('approved', true)
                  ->where('is_disabled', false);
            }])
            ->firstOrFail();
    }
public function countAll(): int
{
    return Article::count();
}

public function countByStatus(string $status): int
{
    return Article::where('status', $status)->count();
}

    public function related(int $id)
    {
        $article = Article::findOrFail($id);

        return Article::where('id', '!=', $id)
            ->where('status', 'published')
            ->whereHas('categories', fn ($q) =>
                $q->whereIn(
                    'categories.id',
                    $article->categories->pluck('id')
                )
            )
            ->limit(4)
            ->get();
    }
}
