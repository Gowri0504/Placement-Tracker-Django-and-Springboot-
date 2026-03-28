import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Trophy, Medal, Loader2, TrendingUp, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/leaderboard');
        setLeaders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  // Map top 3 to podium positions: [2nd, 1st, 3rd]
  const podium = [
    topThree[1] || null,
    topThree[0] || null,
    topThree[2] || null
  ];

  return (
    <div className="space-y-12 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Hall of Fame</h1>
        <p className="text-slate-400 text-lg">Recognizing our most consistent and dedicated learners</p>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
        {podium.map((student, index) => {
          if (!student) return <div key={index} />;
          
          const isFirst = index === 1;
          const rank = isFirst ? 1 : index === 0 ? 2 : 3;
          const colorClass = rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-amber-600';
          const bgClass = rank === 1 ? 'bg-yellow-500/10' : rank === 2 ? 'bg-slate-300/10' : 'bg-amber-600/10';

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group ${isFirst ? 'z-10 -mt-8' : ''}`}
            >
              <Card className={`text-center p-8 border-2 transition-all duration-300 group-hover:scale-105 ${colorClass} ${bgClass}`}>
                <div className="relative inline-block mb-6">
                  <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 ${colorClass} shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                    <span className="text-3xl font-bold text-white">
                      {student.fullName[0].toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-300' : 'bg-amber-600'
                  }`}>
                    {rank === 1 ? <Trophy size={20} className="text-slate-900" /> : <Medal size={20} className="text-slate-900" />}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 truncate">{student.fullName}</h3>
                <p className="text-sm text-slate-400 mb-6 truncate">{student.college || 'Engineering Student'}</p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">XP Points</p>
                    <div className="flex items-center justify-center gap-1">
                      <Zap size={14} className="text-primary" />
                      <p className="text-lg font-bold text-white">{student.xp}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Level</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star size={14} className="text-emerald-500" />
                      <p className="text-lg font-bold text-white">{student.level}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Table */}
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden bg-slate-900/40 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">XP</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Level</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Streak</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leaders.map((student, index) => (
                  <tr key={student.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all group-hover:scale-110 ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 
                        index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' :
                        index === 2 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/50' : 'text-slate-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                          {student.fullName[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-primary transition-colors">{student.fullName}</div>
                          <div className="text-xs text-slate-500">{student.college || 'Engineering College'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <Zap size={14} className="text-primary" />
                        <span className="font-bold text-white">{student.xp}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <Star size={14} className="text-emerald-500" />
                        <span className="font-bold text-white">{student.level}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-white">{student.streak || 0}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Days</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <TrendingUp size={20} className="text-emerald-500" />
                      </div>
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

export default Leaderboard;
