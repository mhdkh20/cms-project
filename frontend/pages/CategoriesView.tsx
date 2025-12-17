import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Article, Category } from '../types';
import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page?: number;
  total?: number;
}
  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selectedSlug) {
        // Automatically select first category
        setSelectedSlug(categories[0].slug);
    }
  }, [categories, selectedSlug]);

useEffect(() => {
  if (selectedSlug) {
    setLoading(true);
    api
      .get(`/categories/${selectedSlug}/articles`)
      .then(res => {
        // res.data is undefined; the API wrapper returns JSON directly
        setArticles(res.data || res.data?.data || []); // fallback
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }
}, [selectedSlug]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar List */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <h3 className="font-bold text-gray-900 p-4 border-b">Categories</h3>
            <div className="p-2 space-y-1">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedSlug(cat.slug)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                            selectedSlug === cat.slug ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Folder size={18} />
                        <span className="font-medium">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="md:col-span-3">
         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-gray-400">Category:</span>
            <span>{categories.find(c => c.slug === selectedSlug)?.name}</span>
         </h2>

         {loading ? (
             <div className="text-center py-10">Loading...</div>
         ) : articles.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {articles.map(article => (
                    <Link to={`/articles/${article.id}`} key={article.id} className="flex bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition h-32 border border-gray-100">
                        <div className="w-32 flex-shrink-0">
                            <img src={article.image } alt="image not exist" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                            <span className="text-xs text-gray-500">{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                    </Link>
                 ))}
             </div>
         ) : (
             <div className="bg-white p-10 rounded-xl text-center text-gray-500 border border-gray-100">
                 No articles found in this category.
             </div>
         )}
      </div>
    </div>
  );
};

export default CategoriesView;
