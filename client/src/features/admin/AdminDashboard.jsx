import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import { Users, BookOpen, Target, Download, PieChart, TrendingUp, AlertCircle, Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('xp');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/batch-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users-performance');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users performance:', err);
      }
    };
    fetchAdminStats();
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase();
    const list = users.filter(u => 
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q) ||
      (u.targetRole || '').toLowerCase().includes(q)
    );
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'xp') return b.xp - a.xp;
      if (sortBy === 'solved') return b.solved - a.solved;
      if (sortBy === 'badges') return b.badges - a.badges;
      return b.xp - a.xp;
    });
    return sorted;
  }, [users, query, sortBy]);

  const distributionData = [
    { name: 'High Readiness (80%+)', value: 15, color: '#10b981' },
    { name: 'Medium Readiness (50-80%)', value: 45, color: '#3b82f6' },
    { name: 'Low Readiness (<50%)', value: 20, color: '#f43f5e' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Placement Cell Dashboard</h1>
          <p className="text-slate-400">Monitoring batch performance and readiness trends</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-white hover:bg-slate-800 transition-all">
          <Download size={18} />
          <span>Export Reports</span>
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">Total Students</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalStudents || 120}</h3>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-400/60 mt-4">Across all departments</p>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Total Problems</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats?.totalProblemsSolved || 2450}</h3>
            </div>
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <BookOpen size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-400/60 mt-4">Avg. 20.4 per student</p>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Placement Drives</p>
              <h3 className="text-3xl font-bold text-white mt-1">12</h3>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
              <Target size={20} />
            </div>
          </div>
          <p className="text-xs text-purple-400/60 mt-4">8 Active this week</p>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Avg. Readiness</p>
              <h3 className="text-3xl font-bold text-white mt-1">68%</h3>
            </div>
            <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-400/60 mt-4">+5% from last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Readiness Distribution */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-primary" />
            Readiness Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {distributionData.map(item => (
              <div key={item.name} className="text-center">
                <div className="text-xs text-slate-500 mb-1">{item.name}</div>
                <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Departments */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Top Departments
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Computer Science', score: 82, students: 45 },
              { name: 'Information Tech', score: 78, students: 40 },
              { name: 'Electronics', score: 65, students: 25 },
              { name: 'Electrical', score: 58, students: 10 },
            ].map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-200">{dept.name}</span>
                  <span className="text-slate-400">{dept.students} Students</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${dept.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Users Performance
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, department..."
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 outline-none focus:border-primary w-64"
              />
            </div>
            <button 
              onClick={() => setSortBy(prev => prev === 'xp' ? 'solved' : prev === 'solved' ? 'badges' : 'xp')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors text-sm"
            >
              <ArrowUpDown size={16} />
              Sort: {sortBy.toUpperCase()}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3">Dept</th>
                <th className="p-3">Target Role</th>
                <th className="p-3">XP</th>
                <th className="p-3">Solved</th>
                <th className="p-3">Badges</th>
                <th className="p-3">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                  <td className="p-3 text-white font-medium">{u.username}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3 text-slate-400 text-center">{u.department}</td>
                  <td className="p-3 text-slate-400 text-center">{u.targetRole}</td>
                  <td className="p-3 text-primary text-center font-bold">{u.xp}</td>
                  <td className="p-3 text-slate-300 text-center">{u.solved}</td>
                  <td className="p-3 text-slate-300 text-center">{u.badges}</td>
                  <td className="p-3 text-slate-400 text-center">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Critical Alerts */}
      <Card className="border-rose-500/20 bg-rose-500/5">
        <h3 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          Critical Alerts
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-rose-500/10">
            <div className="p-2 bg-rose-500/20 rounded-full text-rose-500">
              <Users size={16} />
            </div>
            <div>
              <h4 className="font-bold text-white">20 Students haven't logged activity this week</h4>
              <p className="text-sm text-slate-400 mt-1">Recommend sending a reminder notification to improve consistency.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-amber-500/10">
            <div className="p-2 bg-amber-500/20 rounded-full text-amber-500">
              <BookOpen size={16} />
            </div>
            <div>
              <h4 className="font-bold text-white">Low score in 'System Design' across the batch</h4>
              <p className="text-sm text-slate-400 mt-1">Current batch average is 42%. Consider scheduling a mentor session.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
