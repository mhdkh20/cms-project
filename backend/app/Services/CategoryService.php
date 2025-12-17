<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    public function list()
    {
        return Category::orderBy('name')->get();
    }

    public function create(array $data): Category
    {
        return Category::create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
        ]);
    }
public function countAll(): int
{
    return Category::count();
}

    public function update(Category $category, array $data): Category
    {
        $category->update([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
        ]);

        return $category;
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    // Public API usage
    public function articlesBySlug(string $slug)
    {
        return Category::where('slug', $slug)
            ->firstOrFail()
            ->articles()
            ->where('status', 'published')
            ->paginate(5);
    }
}
