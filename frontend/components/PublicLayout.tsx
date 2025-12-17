import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search } from 'lucide-react';
import { APP_NAME } from '../constants';

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
                <Globe className="h-8 w-8" />
                <span>{APP_NAME}</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className={`${isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'} font-medium transition`}>
                Home
              </Link>
              <Link to="/categories" className={`${isActive('/categories') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'} font-medium transition`}>
                Categories
              </Link>
              <Link to="/contact" className={`${isActive('/contact') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'} font-medium transition`}>
                Contact
              </Link>
            </nav>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2">
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
                Home
              </Link>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
                Categories
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-xl font-bold">{APP_NAME}</p>
          <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          <div className="mt-4">
            <Link to="/admin" className="text-xs text-gray-600 hover:text-gray-400">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
