import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProblemTracker = () => {
  const [problems, setProblems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    isCorrect: true,
    timeTakenMinutes: 30
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get('/problems');
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/problems', formData);
      setShowForm(false);
      setFormData({
        title: '', link: '', platform: 'LeetCode', difficulty: 'Medium', isCorrect: true, timeTakenMinutes: 30
      });
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  const removeProblem = async (id) => {
    try {
      await api.delete(`/problems/${id}`);
      setProblems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Problem Tracker</h1>
          <p className="text-slate-400 mt-2">Log your daily DSA practice.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Log Problem
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-2xl mx-auto border-primary/30 shadow-primary/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Problem Title</label>
                <input 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Two Sum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Link</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  placeholder="https://leetcode.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Platform</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  {['LeetCode', 'GFG', 'HackerRank', 'CodeStudio', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                >
                  {['Easy', 'Medium', 'Hard'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Time Taken (min)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  value={formData.timeTakenMinutes}
                  onChange={e => setFormData({...formData, timeTakenMinutes: parseInt(e.target.value)})}
                  placeholder="30"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Problem</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map(problem => (
          <Card key={problem.id} className="p-5 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors truncate pr-4">
                  {problem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                    problem.difficulty === 'Easy' ? 'border-green-500/20 text-green-500/70 bg-green-500/5' :
                    problem.difficulty === 'Medium' ? 'border-amber-500/20 text-amber-500/70 bg-amber-500/5' :
                    'border-rose-500/20 text-rose-500/70 bg-rose-500/5'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {problem.platform}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {problem.link && (
                  <a href={problem.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-primary">
                    <FiExternalLink size={16} />
                  </a>
                )}
                <button onClick={() => removeProblem(problem.id)} className="p-2 text-slate-500 hover:text-rose-500">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500">
                Time: <span className="text-slate-300 font-medium">{problem.timeTakenMinutes}m</span>
              </div>
              <div className="text-xs text-slate-500">
                Solved: <span className="text-slate-300 font-medium">{new Date(problem.solvedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
        {problems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No problems logged yet. Start solving!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemTracker;
