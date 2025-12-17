import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await api.get<Category[]>('/admin/categories');
    setCategories(data || []);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete category?')) {
      await api.delete(`/admin/categories/${id}`);
      loadCategories();
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({ name: cat.name, slug: cat.slug });
    setEditingId(cat.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/admin/categories/${editingId}`, formData);
    } else {
      await api.post('/admin/categories', formData);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    loadCategories();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => { setEditingId(null); setFormData({name:'', slug:''}); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Slug</th>
              <th className="p-4 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.slug}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
