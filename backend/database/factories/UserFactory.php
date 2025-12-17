<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'editor',
        ];
    }

    public function admin()
    {
        return $this->state(fn () => ['role' => 'admin']);
    }

    public function superAdmin()
    {
        return $this->state(fn () => ['role' => 'super_admin']);
    }
}
