<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ArticlePolicy
{
    /**
     * Determine whether the user can view any models.
     */
     public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, Article $article)
    {
        return $user->isAdmin() || $article->user_id === $user->id;
    }

    public function delete(User $user, Article $article)
    {
        return $user->isSuperAdmin();
    }
}
