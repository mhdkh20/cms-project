<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Article;
use App\Models\Comment;
use App\Models\ContactMessage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin
        $superAdmin = User::factory()->superAdmin()->create([
            'name' => 'Super Admin',
            'email' => 'super@admin.com',
        ]);

        // 2. Admin
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
        ]);

        // 3. Editors
        User::factory()->count(5)->create();

        // 4. Categories
        $categories = Category::factory()->count(6)->create();

        // 5. Articles
        Article::factory()
            ->count(30)
            ->create()
            ->each(function ($article) use ($categories) {

                // Attach random categories
                $article->categories()->attach(
                    $categories->random(rand(1, 3))->pluck('id')
                );

                // Comments
                Comment::factory()
                    ->count(rand(0, 5))
                    ->create([
                        'article_id' => $article->id,
                    ]);
            });

        // 6. Contact Messages
        ContactMessage::factory()->count(15)->create();
    }
}
