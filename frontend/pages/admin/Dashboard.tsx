import React, { useEffect, useState } from 'react';
import { FileText, Folder, MessageSquare, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface DashboardStats {
  total_articles: number;
  total_categories: number;
  pending_comments: number;
  total_messages: number;
}

const DashboardCard = ({
  title,
  count,
  icon,
  link,
  color,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  link: string;
  color: string;
}) => (
  <Link
    to={link}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
      <span className="text-3xl font-bold text-gray-900">{count}</span>
    </div>
    <h3 className="text-gray-500 font-medium">{title}</h3>
  </Link>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get<DashboardStats>('/admin/dashboard');
      setStats(res);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  if (!stats) {
    return <div className="text-center py-20">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Articles"
          count={stats.total_articles}
          icon={<FileText size={24} />}
          link="/admin/articles"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Categories"
          count={stats.total_categories}
          icon={<Folder size={24} />}
          link="/admin/categories"
          color="bg-purple-500"
        />
        <DashboardCard
          title="Pending Comments"
          count={stats.pending_comments}
          icon={<MessageSquare size={24} />}
          link="/admin/comments"
          color="bg-orange-500"
        />
        <DashboardCard
          title="Messages"
          count={stats.total_messages}
          icon={<Mail size={24} />}
          link="/admin/messages"
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/admin/articles"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            Write New Article
          </Link>
          <Link
            to="/admin/categories"
            className="bg-secondary text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
          >
            Add Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
