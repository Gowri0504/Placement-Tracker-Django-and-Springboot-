import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import { Trophy, Medal, Star, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Global');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await api.get('/rankings/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-slate-400">Top performers based on consistency and problem-solving</p>
        </div>
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
          {['Global', 'College', 'Batch'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {leaders.slice(0, 3).map((ranking, index) => {
          const podiumOrder = [1, 0, 2]; // Map 0->Center, 1->Left, 2->Right
          const displayRanking = leaders[podiumOrder[index]];
          if (!displayRanking) return null;
          
          const rank = podiumOrder[index] + 1;
          const isFirst = rank === 1;

          return (
            <motion.div
              key={displayRanking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${isFirst ? 'md:order-2' : podiumOrder[index] === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <Card className={`text-center ${isFirst ? 'border-primary/50 bg-primary/5' : ''}`}>
                <div className="relative inline-block mb-4">
                  <div className={`w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 ${
                    rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-amber-600'
                  }`}>
                    <span className="text-2xl font-bold text-white">
                      {displayRanking.user.fullName[0].toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-300' : 'bg-amber-600'
                  }`}>
                    {rank === 1 ? <Trophy size={16} className="text-slate-900" /> : <Medal size={16} className="text-slate-900" />}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{displayRanking.user.fullName}</h3>
                <p className="text-sm text-slate-400 mb-3">{displayRanking.user.role}</p>
                <div className="bg-slate-900/50 rounded-lg p-2 flex justify-around">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">PRS Score</p>
                    <p className="font-bold text-primary">{displayRanking.prsScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Rank</p>
                    <p className="font-bold text-white">#{displayRanking.globalRank}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rank</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">PRS Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((ranking) => (
              <tr key={ranking.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    ranking.globalRank === 1 ? 'bg-yellow-500 text-slate-900' : 
                    ranking.globalRank === 2 ? 'bg-slate-300 text-slate-900' :
                    ranking.globalRank === 3 ? 'bg-amber-600 text-slate-900' : 'text-slate-500'
                  }`}>
                    {ranking.globalRank}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                      {ranking.user.fullName[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white">{ranking.user.fullName}</div>
                      <div className="text-xs text-slate-500">{ranking.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="font-bold text-primary">{ranking.prsScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-400">{ranking.user.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Leaderboard;
