import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Article, Category } from '../types';
import { Search, Calendar, User, Tag } from 'lucide-react';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch articles
      const articlesRes = await api.get<any>('/articles'); // Assuming API returns data or paginated object
      const articlesData = Array.isArray(articlesRes) ? articlesRes : articlesRes.data;
      setArticles(articlesData || []);

      // Fetch categories for filter
      const categoriesRes = await api.get<Category[]>('/categories');
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error("Failed to load content", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
  const matchesSearch =
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory = selectedCategory
    ? article.categories?.some(
        (cat) => cat.id.toString() === selectedCategory
      )
    : true;

  return matchesSearch && matchesCategory;
});


  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero / Filter Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Latest Articles</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link to={`/articles/${article.id}`} key={article.id} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-200">
                <img 
                  src={article.image } 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-primary uppercase tracking-wide flex-wrap">
  {article.categories && article.categories.length > 0 ? (
    article.categories.map((cat) => (
      <span
        key={cat.id}
        className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
      >
        {cat.name}
      </span>
    ))
  ) : (
    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
      Uncategorized
    </span>
  )}
</div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition">{article.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {article.content.replace(/<[^>]+>/g, '')}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                 <div className="flex items-center gap-1">
  <User size={14} />
  <span>{article.author?.name ?? 'Admin'}</span>
</div>
                   <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
