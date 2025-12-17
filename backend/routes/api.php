<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CorsMiddleware;

use App\Http\Controllers\Api\{
    HomeController,
    ArticleController,
    CategoryController,
    ContactController,
    CommentController
};

use App\Http\Controllers\Admin\{
    AuthController,
    AdminArticleController,
    AdminCategoryController,
    AdminCommentController,
    AdminContactController,
    DashboardController
};


/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

Route::get('/home', [HomeController::class, 'index']);

/* Articles */
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/articles/{id}/related', [ArticleController::class, 'related']);

/* Comments */
Route::post('/articles/{articleId}/comments', [CommentController::class, 'store']);

/* Categories */
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}/articles', [CategoryController::class, 'articles']);

/* Contact */
Route::post('/contact', [ContactController::class, 'store']);


/*
|--------------------------------------------------------------------------
| ADMIN API 
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN API
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    /* Auth */   
     Route::post('/login', [AuthController::class, 'login']);

    Route::middleware([CorsMiddleware::class])->group(function() {


    Route::middleware(['auth:sanctum', 'role:admin,super_admin','cors'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::post('/logout', [AuthController::class, 'logout']);

        /* -------- Articles -------- */
        Route::get('/articles', [AdminArticleController::class, 'index']);
        Route::post('/articles', [AdminArticleController::class, 'store']);
        Route::get('/articles/{article}', [AdminArticleController::class, 'show']);
        Route::put('/articles/{article}', [AdminArticleController::class, 'update']);
        Route::delete('/articles/{article}', [AdminArticleController::class, 'destroy']);
        Route::patch(
            '/articles/{article}/toggle-publish',
            [AdminArticleController::class, 'togglePublish']
        );

        /* -------- Categories -------- */
        Route::apiResource('/categories', AdminCategoryController::class)
            ->except(['show']);

        /* -------- Comments -------- */
        Route::get('/comments', [AdminCommentController::class, 'index']);
        Route::patch('/comments/{comment}/approve', [AdminCommentController::class, 'approve']);
        Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy']);

        /* -------- Contact Messages -------- */
        Route::get('/contacts', [AdminContactController::class, 'index']);
        Route::get('/contacts/{message}', [AdminContactController::class, 'show']);
        Route::patch(
            '/contacts/{message}/review',
            [AdminContactController::class, 'markReviewed']
        );
    });
    });
});
