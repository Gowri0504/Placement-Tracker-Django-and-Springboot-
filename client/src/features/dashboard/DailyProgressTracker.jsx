import React, { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { FiCheckCircle, FiCircle, FiTrendingUp, FiCalendar, FiEdit3, FiSave } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ROUNDS = [
  { id: 'Aptitude', label: 'Aptitude & Verbal' },
  { id: 'DSA', label: 'DSA & Coding' },
  { id: 'Core', label: 'Core Subjects' },
  { id: 'Projects', label: 'Projects & Dev' },
  { id: 'Online Test', label: 'Online Test' },
  { id: 'Interview', label: 'Interview' }
];

const TOPIC_OPTIONS = [
  'Arrays & Strings', 'Linked List', 'Trees & Graphs', 'DP & Greedy', 
  'OS (Process/Threads)', 'DBMS (SQL/Normalize)', 'Computer Networks', 'OOPs Concepts',
  'System Design', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'
];

const DailyProgressTracker = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('last7'); // last7, last30, month

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs');
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch logs', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newLog, setNewLog] = useState({
    roundType: 'DSA',
    topic: '',
    timeSpentMinutes: 60,
    difficulty: 'Medium',
    notes: ''
  });

  const addLog = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/logs', {
        topic: `${newLog.roundType}: ${newLog.topic}`,
        timeSpentMinutes: newLog.timeSpentMinutes,
        difficulty: newLog.difficulty,
        notes: newLog.notes
      });
      setLogs(prev => [res.data, ...prev]);
      setNewLog({ roundType: 'DSA', topic: '', timeSpentMinutes: 60, difficulty: 'Medium', notes: '' });
    } catch (err) {
      console.error('Failed to save log', err);
      setError('Failed to save your activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLog = async (id) => {
    try {
      await api.delete(`/logs/${id}`);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addLog();
  };

  if (loading) return <div className="text-center p-10 text-slate-500">Syncing logs...</div>;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <FiEdit3 className="text-primary" />
          Log Daily Activity
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select 
            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none"
            value={newLog.roundType}
            onChange={e => setNewLog({...newLog, roundType: e.target.value})}
            required
            disabled={submitting}
          >
            {ROUNDS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <select 
            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none"
            value={newLog.topic}
            onChange={e => setNewLog({...newLog, topic: e.target.value})}
            required
            disabled={submitting}
          >
            <option value="">Select Topic...</option>
            {TOPIC_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input 
            type="number"
            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-primary outline-none"
            placeholder="Minutes spent..."
            value={newLog.timeSpentMinutes}
            onChange={e => setNewLog({...newLog, timeSpentMinutes: parseInt(e.target.value)})}
            required
            disabled={submitting}
          />
          <Button type="submit" disabled={submitting} className="flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Activity
              </>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {logs.map(log => (
          <Card key={log.id} className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-primary border border-slate-800">
                <FiCalendar />
              </div>
              <div>
                <h4 className="font-bold text-white">{log.topic}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className="text-xs text-primary">{log.timeSpentMinutes} mins</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className={`text-xs ${
                    log.difficulty === 'Hard' ? 'text-rose-400' : 
                    log.difficulty === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{log.difficulty}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteLog(log.id)}
              className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyProgressTracker;
