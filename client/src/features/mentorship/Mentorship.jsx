import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, Calendar, Video, Star, MessageSquare, Clock, X, Shield, Radio, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Mentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mentors');
  const [liveSession, setLiveSession] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'mentor', text: 'Hello! Ready for our session?', time: '10:00 AM' }
  ]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Simulate real-time status updates every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [mentorsRes, sessionsRes] = await Promise.all([
        api.get('/mentorship/mentors'),
        api.get('/mentorship/sessions')
      ]);
      setMentors(Array.isArray(mentorsRes.data) ? mentorsRes.data : []);
      setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch mentorship data. Please try again.');
      setMentors([]);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async (mentorId) => {
    try {
      await api.post('/mentorship/sessions', {
        mentorId,
        type: 'Mock Interview',
        date: new Date(Date.now() + 3600000) // 1 hour from now for "near real-time" demo
      });
      alert('Session requested successfully! Check "My Sessions" for status.');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMessage('');
    // Simulate mentor reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'mentor', text: 'I understand. Let\'s focus on that part.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Mentorship Module...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Mentorship & Guidance</h1>
          <p className="text-slate-400 mt-2">Connect with industry experts for real-time guidance.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('mentors')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mentors' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Find Mentors
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            My Sessions
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <Shield size={18} />
          {error}
        </div>
      )}

      {activeTab === 'mentors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex flex-col items-center text-center p-8 group hover:border-primary/50 transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">
                  {mentor.username[0].toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">{mentor.username}</h3>
                <p className="text-primary text-sm font-medium mb-4">{mentor.profile?.targetRole || 'Industry Mentor'}</p>
                
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                  <span className="text-xs text-slate-500 ml-2">(12 reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-white font-bold text-sm">45+</div>
                    <div className="text-[10px] text-slate-500 uppercase">Sessions</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-white font-bold text-sm">Online</div>
                    <div className="text-[10px] text-slate-500 uppercase">Status</div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => bookSession(mentor._id)}>
                  Request Mentorship
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session, i) => {
              const isLive = session.status === 'Scheduled'; // Simplified for demo
              return (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`flex flex-col md:flex-row items-center justify-between p-6 gap-6 ${isLive ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isLive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                        {session.type === 'Mock Interview' ? <Video size={24} /> : <MessageSquare size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{session.type}</h4>
                          {isLive && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-full">
                              <Radio size={10} className="animate-pulse" /> Live Now
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          with <span className="text-primary font-medium">{session.mentorId?.username}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-8">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={16} />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Clock size={16} />
                        {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        session.status === 'Scheduled' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        session.status === 'Requested' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {session.status}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isLive ? (
                        <Button variant="accent" onClick={() => setLiveSession(session)}>
                          Join Room
                        </Button>
                      ) : (
                        <Button variant="ghost" className="text-slate-400 hover:text-white">Reschedule</Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="py-20 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <Users size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
              <p className="text-slate-500">Book your first mentorship session with one of our experts.</p>
            </div>
          )}
        </div>
      )}

      {/* Live Session Modal / Overlay */}
      <AnimatePresence>
        {liveSession && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col md:flex-row"
          >
            {/* Video Area */}
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                <div className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> REC
                </div>
                <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-xs text-white border border-slate-700">
                  {liveSession.type} with {liveSession.mentorId?.username}
                </div>
              </div>

              {/* Mock Video Content */}
              <div className="w-full h-full flex items-center justify-center text-slate-800">
                <Video size={120} strokeWidth={1} />
                <div className="absolute bottom-10 flex gap-4">
                  <button className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"><Video size={20} /></button>
                  <button className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 transition-colors" onClick={() => setLiveSession(null)}><X size={20} /></button>
                  <button className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"><Shield size={20} /></button>
                </div>
              </div>

              {/* Self View */}
              <div className="absolute top-6 right-6 w-48 h-32 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center text-slate-700">
                 <Users size={32} />
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary" /> Session Chat
                </h3>
                <button onClick={() => setLiveSession(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
                <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                  <MessageSquare size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentorship;
