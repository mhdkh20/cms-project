<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'article_id' => Article::factory(),
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'comment' => $this->faker->paragraph(),
            'approved' => $this->faker->boolean(70),
            'is_disabled' => false,
        ];
    }
}
