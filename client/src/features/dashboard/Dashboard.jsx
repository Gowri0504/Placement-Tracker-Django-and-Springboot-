import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Check, Loader2 } from 'lucide-react';
import { FiCode, FiTrendingUp, FiActivity, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import QuoteCard from '../../components/dashboard/QuoteCard';
import InsightsCard from '../../components/dashboard/InsightsCard';

const StatCard = ({ title, value, icon, trend, color }) => (
  <Card className="relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl ${color}`}>
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-sm text-green-400">
          <FiTrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [prsData, setPrsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'aptitude', label: 'Aptitude & Verbal', key: 'aptitude' },
    { id: 'dsa', label: 'DSA & Coding', key: 'dsa' },
    { id: 'core', label: 'Core Subjects', key: 'core' },
    { id: 'project', label: 'Projects & Dev', key: 'project' },
    { id: 'test', label: 'Online Test', key: 'test' },
    { id: 'interview', label: 'Interview', key: 'interview' },
  ];

  const CustomDot = (props) => {
    const { cx, cy, value } = props;
    return (
      <>
        <circle cx={cx} cy={cy} r={3} fill="#8b5cf6" stroke="none" />
        <text x={cx + 6} y={cy - 6} fill="#cbd5e1" fontSize="10">{value}</text>
      </>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [progressRes, statsRes, prsRes] = await Promise.allSettled([
          api.get(`/progress/user/${user.id}`),
          api.get('/analytics'),
          api.get('/rankings/my-rank')
        ]);
        
        if (progressRes.status === 'fulfilled') setProgressData(progressRes.value.data || []);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || {});
        if (prsRes.status === 'fulfilled') setPrsData(prsRes.value.data || {});
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleCheckboxChange = async (date, sectionKey, value) => {
    const prevData = [...progressData];
    const existingEntry = progressData.find(p => p.date === date) || {
      date,
      aptitude: false,
      dsa: false,
      core: false,
      project: false,
      test: false,
      interview: false,
      topics: ''
    };

    const updatedEntry = { ...existingEntry, [sectionKey]: value };
    
    setProgressData(prev => {
      const index = prev.findIndex(p => p.date === date);
      if (index > -1) {
        const newArr = [...prev];
        newArr[index] = updatedEntry;
        return newArr;
      }
      return [updatedEntry, ...prev];
    });

    try {
      setSaving(true);
      const res = await api.post('/progress/save', updatedEntry);
      setProgressData(prev => prev.map(p => p.date === date ? res.data : p));
    } catch (err) {
      console.error('Error saving progress:', err);
      if (err.message === 'Network Error') {
        console.warn('Network error, keeping change locally only');
      } else {
        setProgressData(prevData);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTopicChange = (date, topics) => {
    setProgressData(prev => {
      const exists = prev.some(p => p.date === date);
      if (!exists) {
        return [{ date, aptitude: false, dsa: false, core: false, project: false, test: false, interview: false, topics }, ...prev];
      }
      return prev.map(p => p.date === date ? { ...p, topics } : p);
    });
  };

  const handleTopicBlur = async (date) => {
    const entry = progressData.find(p => p.date === date);
    if (entry) {
      try {
        setSaving(true);
        const res = await api.post('/progress/save', entry);
        setProgressData(prev => prev.map(p => p.date === date ? res.data : p));
      } catch (err) {
        console.error('Error saving topic:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const calculateConsistency = (sectionKey) => {
    if (progressData.length === 0) return 0;
    const completed = progressData.filter(p => p[sectionKey]).length;
    return Math.round((completed / Math.max(progressData.length, 1)) * 100);
  };

  const tableDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    tableDates.push(d.toISOString().split('T')[0]);
  }

  const displayData = tableDates.map(date => {
    return progressData.find(p => p.date === date) || {
      date,
      aptitude: false,
      dsa: false,
      core: false,
      project: false,
      test: false,
      interview: false,
      topics: ''
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Syncing your progress...</p>
        </div>
      </div>
    );
  }

  const chartData = stats?.difficultyCounts?.length ? stats.difficultyCounts.map(d => ({ name: d._id, value: d.count })) : [];
  const skillsData = stats?.skillsData || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome back! Track your daily preparation and performance metrics.</p>
      </div>

      <QuoteCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Solved" value={stats?.totalSolved || 0} icon={<FiCode />} trend="Real-time" color="text-blue-500" />
        <StatCard title="Placement Readiness" value={prsData?.prsScore ? `${prsData.prsScore}%` : '0%'} icon={<FiTrendingUp />} trend="Target: 90%+" color="text-emerald-500" />
        <StatCard title="Global Rank" value={prsData?.globalRank ? `#${prsData.globalRank}` : 'N/A'} icon={<FiActivity />} trend="Update: Weekly" color="text-primary" />
        <StatCard title="Consistency Streak" value={user?.streak ? `${user.streak} Days` : '0 Days'} icon={<FiCheckCircle />} trend="Keep it up!" color="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6">Readiness Breakdown</h3>
          <div className="space-y-6">
            {prsData?.breakdown ? Object.entries(prsData.breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white font-bold">{val}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className={`h-full bg-gradient-to-r ${
                      val > 80 ? 'from-emerald-500 to-teal-500' : 
                      val > 50 ? 'from-blue-500 to-indigo-500' : 
                      'from-rose-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>
            )) : (
              ['Accuracy', 'Difficulty', 'Consistency', 'Core Coverage', 'Time Efficiency'].map(label => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-bold">0%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/20 w-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="lg:col-span-1">
          <InsightsCard prsData={prsData} stats={stats} />
        </div>

        <Card className="lg:col-span-1 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Skill Analysis</h3>
          <div className="flex-1 w-full min-h-0">
            {skillsData && skillsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    dot={<CustomDot />}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm italic border border-dashed border-slate-800 rounded-xl">
                No skill analysis data available yet.
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-3 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Problem Solving Distribution</h3>
          <div className="flex-1 w-full min-h-0">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm italic border border-dashed border-slate-800 rounded-xl">
                Start solving problems to see your distribution chart.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Preparation Tracker</h2>
          <div className="flex items-center gap-4">
            {saving && <div className="flex items-center gap-2 text-primary text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</div>}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm border border-slate-700">
              <FiPlus /> Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {sections.map(section => {
            const consistency = calculateConsistency(section.key);
            return (
              <Card key={section.id} className="p-4">
                <h3 className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-2 truncate">{section.label}</h3>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xl font-bold text-white">{consistency}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${consistency}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden border-slate-800 bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  {sections.map(s => (
                    <th key={s.id} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{s.label}</th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Topics Learned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {displayData.map((row) => (
                  <tr key={row.date} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    {sections.map(s => (
                      <td key={s.id} className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer p-2">
                          <input 
                            type="checkbox" 
                            checked={row[s.key] || false}
                            onChange={(e) => handleCheckboxChange(row.date, s.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 bg-slate-800 border-2 border-slate-700 rounded peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all">
                            {row[s.key] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </div>
                        </label>
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={row.topics || ''}
                        onChange={(e) => handleTopicChange(row.date, e.target.value)}
                        onBlur={() => handleTopicBlur(row.date)}
                        placeholder="Topics..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
