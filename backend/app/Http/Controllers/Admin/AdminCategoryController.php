<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;

class AdminCategoryController extends Controller
{
    protected CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json(
            $this->service->list()
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->service->create(
            $request->validated()
        );

        return response()->json($category, 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $updated = $this->service->update(
            $category,
            $request->validated()
        );

        return response()->json($updated);
    }

    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return response()->json(['message' => 'Deleted']);
    }
}
