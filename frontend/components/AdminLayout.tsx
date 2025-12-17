import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  MessageSquare, 
  Mail, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Articles', path: '/admin/articles', icon: <FileText size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Folder size={20} /> },
    { name: 'Comments', path: '/admin/comments', icon: <MessageSquare size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 h-16 bg-slate-900">
          <span className="text-xl font-bold tracking-wider">CMS ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)} // Close on mobile select
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-slate-900">
            <div className="flex items-center gap-3 text-gray-300 mb-4 px-2">
                <UserIcon size={18} />
                <span className="text-sm truncate">{user?.name}</span>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm h-16 flex items-center px-4 justify-between">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
             <Menu size={24} />
           </button>
           <span className="font-bold text-gray-800">Dashboard</span>
           <div className="w-6"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
