<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

  protected $fillable = [
    'article_id',
    'name',
    'email',
    'comment',
    'approved',
    'is_disabled',
];


    protected $casts = [
        'approved' => 'boolean',
        'is_disabled' => 'boolean',
    ];

    /* ================== RELATIONS ================== */

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    /* ================== SCOPES ================== */

    public function scopeApproved($query)
    {
        return $query->where('approved', true);
    }
}
