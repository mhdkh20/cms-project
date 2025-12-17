import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ContactMessage } from '../../types';
import { Mail, CheckCircle, Clock } from 'lucide-react';

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};


const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages(currentPage);
  }, [currentPage]);

 const loadMessages = async (page: number) => {
  setLoading(true);
  try {
    const response = await api.get<PaginatedResponse<ContactMessage>>(
      `/admin/contacts?page=${page}`
    );

    setMessages(response.data);
    setCurrentPage(response.current_page);
    setLastPage(response.last_page);
  } finally {
    setLoading(false);
  }
};

  const markReviewed = async (id: number) => {
    await api.patch(`/admin/contacts/${id}/review`);
    loadMessages(currentPage);
  };

  // Generate page numbers like: 1 2 3 4 5
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
        Contact Messages
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-600">Sender</th>
              <th className="p-4 text-gray-600">Subject</th>
              <th className="p-4 text-gray-600">Message</th>
              <th className="p-4 text-gray-600">Date</th>
              <th className="p-4 text-right text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading messages...
                </td>
              </tr>
            )}

            {!loading &&
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-gray-50 ${
                    !msg.reviewed ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {msg.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {msg.email}
                    </div>
                  </td>

                  <td className="p-4 font-medium text-gray-800">
                    {msg.subject}
                  </td>

                  <td className="p-4 text-gray-600 max-w-xs truncate">
                    {msg.message}
                  </td>

                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    {msg.reviewed ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} /> Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => markReviewed(msg.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 bg-white px-3 py-1 rounded-md hover:bg-blue-50 transition"
                      >
                        <Clock size={16} /> Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {!loading && messages.length === 0 && (
          <div className="p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No messages found.</p>
          </div>
        )}

        {/* REAL PAGINATION */}
        {lastPage > 1 && (
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

export default AdminMessages;
