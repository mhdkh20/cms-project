<?php

namespace App\Services;

use App\Models\Comment;

class CommentService
{
       public function create(array $data)
    {
        return Comment::create([
            'article_id' => $data['article_id'],
            'name'       => $data['name'],
            'email'      => $data['email'],
            'comment'    => $data['comment'],
            'approved'   => false,
            'is_disabled'=> false,
        ]);
    }

    public function approve(Comment $comment)
    {
        $comment->approved = true;
        $comment->save();

        return $comment;
    }

    public function delete(Comment $comment)
    {
        $comment->delete();
    }
public function countPending(): int
{
    return Comment::where('approved', false)->count();
}

    public function list(array $filters)
    {
        return Comment::with('article')
            ->when(isset($filters['approved']), fn ($q) =>
                $q->where('approved', $filters['approved'])
            )
            ->latest()
            ->paginate(5);
    }
}
