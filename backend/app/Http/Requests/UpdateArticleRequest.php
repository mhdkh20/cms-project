<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true ;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'       => 'sometimes|string|max:255',
            'slug'        => 'sometimes|string|max:255|unique:articles,slug,' . $this->article->id,
            'content'     => 'sometimes|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status'      => 'sometimes|in:published,draft',
            'categories'  => 'nullable|array',
            'categories.*'=> 'exists:categories,id',        
        ];
    }
}
