import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Article } from '../types';
import { Calendar, User, ArrowLeft, Send } from 'lucide-react';

const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Comment form
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentStatus, setCommentStatus] =
    useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (id) fetchArticle(id);
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);

      const articleData = await api.get<Article>(`/articles/${articleId}`);
      setArticle(articleData);

      try {
        const relatedData = await api.get<Article[]>(
          `/articles/${articleId}/related`
        );
        setRelated(relatedData || []);
      } catch {
        setRelated([]);
      }
    } catch (error) {
      console.error('Failed to load article', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setCommentStatus('submitting');

    try {
      await api.post(`/articles/${id}/comments`, {
        name: commentName,
        email: commentEmail,
        comment: commentBody,
      });

      setCommentStatus('success');
      setCommentName('');
      setCommentEmail('');
      setCommentBody('');
    } catch {
      setCommentStatus('error');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Articles
      </Link>

      {/* ARTICLE */}
      <article className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-12">
        <div className="h-64 md:h-96 relative">
          <img
            src={article.image }
            alt={article.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-10">
            {/* Categories */}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {article.categories.map(cat => (
                  <span
                    key={cat.id}
                    className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-200 text-sm">
              <span className="flex items-center gap-1">
                <User size={14} /> {article.author?.name || 'Admin'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />{' '}
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* COMMENTS + FORM */}
        <div className="md:col-span-2 space-y-8">
          {/* Approved Comments */}
          {article.comments && article.comments.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-2xl font-bold mb-6">
                Comments ({article.comments.length})
              </h3>

              <div className="space-y-6">
                {article.comments.map(comment => (
                  <div
                    key={comment.id}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {comment.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-2xl font-bold mb-6">Leave a Comment</h3>

            {commentStatus === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded mb-4">
                Comment submitted successfully. Awaiting approval.
              </div>
            )}

            {commentStatus === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
                Failed to submit comment.
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Name"
                  className="input"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="input"
                  value={commentEmail}
                  onChange={e => setCommentEmail(e.target.value)}
                />
              </div>

              <textarea
                required
                rows={4}
                placeholder="Comment"
                className="input"
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
              />

              <button
                type="submit"
                disabled={commentStatus === 'submitting'}
                className="bg-primary text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={16} /> Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-24">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>

            {related.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {related.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/articles/${rel.id}`}
                    className="block group"
                  >
                    <div className="h-32 rounded overflow-hidden mb-2">
                      <img
                        src={rel.image }
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h4 className="font-bold group-hover:text-primary">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No related articles found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
