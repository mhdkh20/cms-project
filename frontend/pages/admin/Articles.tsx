import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Article, Category } from '../../types';
import { Edit, Trash2, Plus, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Select from 'react-select';

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
}

const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | ''>('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Article | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => { fetchArticles(); fetchCategories(); }, [page, q, status]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (q) params.append('q', q);
      if (status) params.append('status', status);
      const res = await api.get<Paginated<Article>>(`/admin/articles?${params.toString()}`);
      setArticles(res.data || []);
      setLastPage(res.last_page || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { const res = await api.get<Category[]>('/admin/categories'); setCategories(res || []); }
    catch (err) { console.error(err); }
  };

  const toggleStatus = async (id: number) => { await api.patch(`/admin/articles/${id}/toggle-publish`); fetchArticles(); };
  const deleteArticle = async (id: number) => { if (!confirm('Delete?')) return; await api.delete(`/admin/articles/${id}`); fetchArticles(); };

  const startCreate = () => { resetForm(); setView('form'); };
  const startEdit = (a: Article) => {
    setEditing(a);
    setTitle(a.title);
    setContent(a.content);
    setSelectedCategories(a.categories || []);
    setImageFile(null);
    setPreviewImage(a.image || null);
    setView('form');
  };

  const resetForm = () => {
    setEditing(null);
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const submitForm = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  
  // Important: Method Spoofing for Laravel
  if (editing) {
    formData.append('_method', 'PUT');
  }

  selectedCategories.forEach(c => formData.append('categories[]', c.id.toString()));
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    if (editing) {
      // Use POST even for updates, Laravel will treat it as PUT because of '_method'
      await api.postMultipart(`/admin/articles/${editing.id}`, formData);
    } else {
      await api.postMultipart('/admin/articles', formData);
    }
    setView('list'); 
    fetchArticles(); 
    resetForm();
  } catch (err) { 
    console.error(err); 
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Articles</h1>
        {view==='list' && <button onClick={startCreate} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> New Article</button>}
      </div>

      {view==='list' && (
        <>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border rounded-lg"/>
            </div>
            <select value={status} onChange={e=>setStatus(e.target.value as any)} className="border rounded-lg px-3 py-2">
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b"><tr><th className="p-4">Title</th><th className="p-4">Categories</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody>
                {articles.map(a=>(
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{a.title}</td>
                    <td className="p-4 space-x-2">{a.categories?.map(c=><span key={c.id} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">{c.name}</span>)}</td>
                    <td className="p-4">
                      <button onClick={()=>toggleStatus(a.id)} className={`flex items-center gap-1 text-sm ${a.status==='published'?'text-green-600':'text-gray-400'}`}>{a.status==='published'?<Eye size={16}/>:<EyeOff size={16}/>} {a.status}</button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={()=>startEdit(a)}><Edit size={18}/></button>
                      <button onClick={()=>deleteArticle(a.id)}><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && articles.length===0 && <div className="p-8 text-center text-gray-500">No articles found</div>}
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft/></button>
            <span>Page {page} / {lastPage}</span>
            <button disabled={page===lastPage} onClick={()=>setPage(p=>p+1)}><ChevronRight/></button>
          </div>
        </>
      )}

      {view==='form' && (
        <form onSubmit={submitForm} className="bg-white border rounded-xl p-6 space-y-6 mt-4">
          <h2 className="text-xl font-bold">{editing?'Edit Article':'Create Article'}</h2>
          <input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Title" className="w-full border rounded-lg px-4 py-2"/>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border rounded-lg px-4 py-2 w-full"/>
          {previewImage && <img src={previewImage} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded-lg"/>}

          <Select isMulti options={categories.map(c=>({value:c.id,label:c.name}))} value={selectedCategories.map(c=>({value:c.id,label:c.name}))} onChange={selected=>setSelectedCategories((selected as any[]).map(s=>({id:s.value,name:s.label})))} className="basic-multi-select" classNamePrefix="select" placeholder="Select categories..."/>
          <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} required className="w-full border rounded-lg p-3 font-mono"/>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={()=>{setView('list'); resetForm();}} className="border px-6 py-2 rounded-lg">Cancel</button>
            <button className="bg-primary text-white px-6 py-2 rounded-lg">Save</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminArticles;
