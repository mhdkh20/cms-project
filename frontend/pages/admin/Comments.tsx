import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Comment } from '../../types';
import { Trash2, Check, MessageSquare } from 'lucide-react';

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments(currentPage);
  }, [currentPage]);

  const loadComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Comment>>(
        `/admin/comments?page=${page}`
      );

      setComments(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id: number) => {
    await api.patch(`/admin/comments/${id}/approve`);
    loadComments(currentPage);
  };

  const deleteComment = async (id: number) => {
    if (confirm('Delete this comment?')) {
      await api.delete(`/admin/comments/${id}`);
      loadComments(currentPage);
    }
  };

  // Generate an array of page numbers for pagination
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Comments
      </h1>

      <div className="grid gap-4">
        {loading && (
          <div className="text-center py-12 col-span-full">
            Loading comments...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No comments to moderate.</p>
          </div>
        )}

        {!loading &&
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">{comment.name}</span>
                  <span className="text-gray-400 text-sm">&bull; {comment.email}</span>
                  <span className="text-gray-400 text-xs ml-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                  "{comment.comment}"
                </p>
                <div className="mt-2 text-xs text-primary font-medium">
                  Article ID: {comment.article_id}
                </div>
              </div>

              <div className="flex gap-2">
                {!comment.approved && (
                  <button
                    onClick={() => approveComment(comment.id)}
                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition font-medium text-sm"
                  >
                    <Check size={16} /> Approve
                  </button>
                )}
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}

        {/* PAGINATION */}
        {!loading && lastPage > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-4 border-t bg-gray-50">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              «
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              ‹
            </button>

            {getPages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              ›
            </button>
            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(lastPage)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
