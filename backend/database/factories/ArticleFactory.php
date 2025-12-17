<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 9999),
            'content' => '<p>' . implode('</p><p>', $this->faker->paragraphs(5)) . '</p>',
            'image' => 'articles/b05m2hjARhC4JaA2QUBYZNOKkdRgMJUpaIYbUBNT.png',
            'status' => $this->faker->boolean(70) ? 'published' : 'draft',
        ];
    }
}
