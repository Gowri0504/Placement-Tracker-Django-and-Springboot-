import React, { useEffect, useState } from 'react';
import { FiBook, FiCheckCircle, FiCircle, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const SYLLABUS = [
    // 🔹 DSA (Fully Deep)
    { id: 'dsa-1', name: 'Arrays & Strings (Sliding Window, Prefix Sum)', category: 'DSA', subCategory: 'Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-2', name: 'Linked List (Cycle Detection, Fast/Slow)', category: 'DSA', subCategory: 'Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-3', name: 'Stack, Queue & Deque', category: 'DSA', subCategory: 'Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-4', name: 'Hashing (Map, Set, Collisions)', category: 'DSA', subCategory: 'Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-5', name: 'Trees (Binary Tree, BST, AVL)', category: 'DSA', subCategory: 'Non-Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-6', name: 'Heap (Min/Max Heap, Priority Queue)', category: 'DSA', subCategory: 'Non-Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-7', name: 'Trie (Prefix Tree)', category: 'DSA', subCategory: 'Non-Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-8', name: 'Graphs (BFS/DFS, Topological Sort)', category: 'DSA', subCategory: 'Non-Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-9', name: 'Advanced Graphs (Dijkstra, Bellman-Ford, MST)', category: 'DSA', subCategory: 'Non-Linear DS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-10', name: 'Recursion & Backtracking', category: 'DSA', subCategory: 'Algorithms', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-11', name: 'Dynamic Programming (Pattern-based)', category: 'DSA', subCategory: 'Algorithms', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-12', name: 'Greedy Algorithms', category: 'DSA', subCategory: 'Algorithms', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-13', name: 'Bit Manipulation', category: 'DSA', subCategory: 'Basics', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dsa-14', name: 'Two Pointers & Binary Search', category: 'DSA', subCategory: 'Algorithms', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 Core Subjects (Advanced Level)
    { id: 'os-1', name: 'Process vs Thread & CPU Scheduling', category: 'Core Subjects', subCategory: 'OS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'os-2', name: 'Deadlock (Detection, Prevention)', category: 'Core Subjects', subCategory: 'OS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'os-3', name: 'Memory Management (Paging, Virtual Memory)', category: 'Core Subjects', subCategory: 'OS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'os-4', name: 'Synchronization (Semaphores, Mutex)', category: 'Core Subjects', subCategory: 'OS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dbms-1', name: 'ER Modeling & Normalization (1NF-BCNF)', category: 'Core Subjects', subCategory: 'DBMS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dbms-2', name: 'Indexing (B+ Trees) & SQL Optimization', category: 'Core Subjects', subCategory: 'DBMS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'dbms-3', name: 'Transactions, ACID & Concurrency Control', category: 'Core Subjects', subCategory: 'DBMS', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'cn-1', name: 'OSI vs TCP/IP & HTTP/HTTPS', category: 'Core Subjects', subCategory: 'Networking', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'cn-2', name: 'TCP vs UDP & Congestion Control', category: 'Core Subjects', subCategory: 'Networking', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'cn-3', name: 'DNS, SSL/TLS & REST APIs', category: 'Core Subjects', subCategory: 'Networking', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'oop-1', name: 'SOLID Principles', category: 'Core Subjects', subCategory: 'OOP', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'oop-2', name: 'Design Patterns (Singleton, Factory, Observer)', category: 'Core Subjects', subCategory: 'OOP', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 Programming Languages
    { id: 'lang-1', name: 'C / C++ Mastery', category: 'Languages', subCategory: 'Backend', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'lang-2', name: 'Java (JVM, Streams, Multithreading)', category: 'Languages', subCategory: 'Backend', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'lang-3', name: 'Python (Data Science, Scripting)', category: 'Languages', subCategory: 'Backend', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'lang-4', name: 'JavaScript (ES6+, Async/Await)', category: 'Languages', subCategory: 'Frontend', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 Web Development
    { id: 'web-1', name: 'Frontend (React, Flexbox, ARIA)', category: 'Web Dev', subCategory: 'Frontend', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'web-2', name: 'Backend Design (JWT, OAuth, API Versioning)', category: 'Web Dev', subCategory: 'Backend', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'web-3', name: 'Databases (MongoDB, SQL, Redis)', category: 'Web Dev', subCategory: 'Database', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 System Design
    { id: 'sd-1', name: 'Scalability, Load Balancing & Caching', category: 'System Design', subCategory: 'HLD', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'sd-2', name: 'Database Sharding & CAP Theorem', category: 'System Design', subCategory: 'HLD', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'sd-3', name: 'Case Studies (URL Shortener, Payment System)', category: 'System Design', subCategory: 'HLD', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 DevOps & Tools
    { id: 'devops-1', name: 'Git (Branching, Strategies)', category: 'DevOps', subCategory: 'Tools', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'devops-2', name: 'Docker & CI/CD Fundamentals', category: 'DevOps', subCategory: 'Automation', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'devops-3', name: 'Linux Commands & Cloud (AWS/GCP)', category: 'DevOps', subCategory: 'Infrastructure', totalSubtopics: 1, completedSubtopics: 0 },

    // 🔹 Interview & Placement
    { id: 'prep-1', name: 'HR & Behavioral Questions (STAR)', category: 'Placement Prep', subCategory: 'HR', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'prep-2', name: 'Resume & Company-specific Prep', category: 'Placement Prep', subCategory: 'Technical', totalSubtopics: 1, completedSubtopics: 0 },
    { id: 'prep-3', name: 'Mock Interviews & GD Topics', category: 'Placement Prep', subCategory: 'Practice', totalSubtopics: 1, completedSubtopics: 0 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsRes = await api.get('/topics');
        const dbTopics = Array.isArray(topicsRes.data) ? topicsRes.data : [];
        
        // Merge syllabus with DB progress
        const merged = SYLLABUS.map(s => {
          const dbMatch = dbTopics.find(t => t.name === s.name);
          if (dbMatch) {
            return { 
              ...s, 
              id: dbMatch.id, // Use DB ID for updates
              completedSubtopics: dbMatch.completedSubtopics,
              completionPercentage: dbMatch.completionPercentage 
            };
          }
          return { ...s, completionPercentage: 0 };
        });
        setTopics(merged);
      } catch (err) {
        console.error("Error fetching topics", err);
        setTopics(SYLLABUS.map(s => ({ ...s, completionPercentage: 0 })));
      }
    };
    fetchData();
  }, []);

  // Group topics by Category -> SubCategory
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = {};
    if (!acc[topic.category][topic.subCategory || 'General']) acc[topic.category][topic.subCategory || 'General'] = [];
    acc[topic.category][topic.subCategory || 'General'].push(topic);
    return acc;
  }, {});

  const getStatus = (topic) => {
    if (topic.completionPercentage >= 100) return 'Mastered';
    if (topic.completionPercentage > 0) return 'In Progress';
    return 'Not Started';
  };

  const [updating, setUpdating] = useState(null); // ID of topic being updated

  const handleStatusUpdate = async (topic, currentStatus) => {
    const isMastered = currentStatus === 'Mastered';
    const newCompleted = isMastered ? 0 : 1; 
    setUpdating(topic.id || topic.name);
    try {
      const response = await api.post('/topics/update', {
        name: topic.name,
        category: topic.category,
        subCategory: topic.subCategory,
        totalSubtopics: topic.totalSubtopics,
        completedSubtopics: newCompleted
      });
      
      const updatedTopic = response.data;
      setTopics(prev => prev.map(t => t.name === topic.name ? { 
        ...t, 
        id: updatedTopic.id,
        completedSubtopics: updatedTopic.completedSubtopics, 
        completionPercentage: updatedTopic.completionPercentage 
      } : t));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredCategories = Object.keys(groupedTopics).filter(cat => 
    filter === 'All' || cat === filter
  ).map(cat => {
    const subCats = groupedTopics[cat];
    const filteredSubCats = {};
    let totalInCat = 0;

    Object.keys(subCats).forEach(subCat => {
      const filteredTopics = subCats[subCat].filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredTopics.length > 0) {
        filteredSubCats[subCat] = filteredTopics;
        totalInCat += filteredTopics.length;
      }
    });

    return totalInCat > 0 ? { name: cat, subCats: filteredSubCats } : null;
  }).filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Topic Explorer</h1>
          <p className="text-slate-400 mt-2">Master your concepts step by step.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'DSA', 'Core Subjects', 'Web Dev', 'Languages', 'System Design', 'DevOps'].map(f => (
              <Button 
                key={f} 
                variant={filter === f ? 'primary' : 'outline'} 
                onClick={() => setFilter(f)}
                className="text-sm px-3 py-1.5"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredCategories.length > 0 ? filteredCategories.map(category => (
        <div key={category.name} className="space-y-6">
          <h2 className="text-2xl font-bold text-primary border-b border-slate-800 pb-2">{category.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(category.subCats).map(subCat => (
              <Card key={subCat} className="h-full flex flex-col hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">{subCat}</h3>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
                    {category.subCats[subCat].length} Topics
                  </span>
                </div>
                
                <div className="space-y-2 flex-1">
                  {category.subCats[subCat].map(topic => {
                    const status = getStatus(topic);
                    const isMastered = status === 'Mastered';
                    const isUpdating = updating === (topic.id || topic.name);
                    
                    return (
                      <div 
                        key={topic.name}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 group hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${isMastered ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                            {isMastered ? <FiCheckCircle /> : <FiCircle />}
                          </div>
                          <div>
                            <h4 className="text-white font-medium group-hover:text-primary transition-colors">{topic.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{status}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusUpdate(topic, status)}
                          disabled={isUpdating}
                          className={isMastered ? 'text-green-400' : 'text-slate-500'}
                        >
                          {isUpdating ? '...' : (isMastered ? 'Mastered' : 'Mark Done')}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )) : (
        <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
          <FiSearch className="mx-auto text-slate-600 mb-4" size={48} />
          <p className="text-slate-400 text-lg">No topics found matching your search.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setFilter('All'); }} className="mt-4">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicList;
