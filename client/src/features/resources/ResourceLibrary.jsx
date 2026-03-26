import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Book, Video, FileText, ExternalLink, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceLibrary = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const STATIC_RESOURCES = [
    { _id: '1', title: 'Placement Preparation Blog', description: 'Topic-wise coding + company questions', link: 'https://www.placementpreparation.io/blog/best-websites-for-technical-interview/', category: 'Company Specific', type: 'Link' },
    { _id: '2', title: 'PrepInsta', description: 'Aptitude + interview + company prep', link: 'https://prepinsta.com/placement-preparation/', category: 'Aptitude', type: 'Link' },
    { _id: '3', title: 'Placement Guider', description: 'Year-wise roadmap + job updates', link: 'https://www.placementguido.com/', category: 'Company Specific', type: 'Link' },
    { _id: '4', title: 'Placement Shiksha', description: 'Structured DSA + system design prep', link: 'https://www.placementshiksha.com/', category: 'DSA', type: 'Link' },
    { _id: '5', title: 'LeetCode', description: 'Industry standard for coding rounds & interviews', link: 'https://leetcode.com', category: 'DSA', type: 'Link' },
    { _id: '6', title: 'GeeksforGeeks', description: 'Comprehensive CS resource hub', link: 'https://www.geeksforgeeks.org', category: 'Core Subjects', type: 'Link' },
    { _id: '7', title: 'TakeUForward (Striver)', description: 'Top tier DSA sheets and explanations', link: 'https://takeuforward.org', category: 'DSA', type: 'Link' },
    { _id: '8', title: 'NeetCode', description: 'DSA roadmap and video solutions', link: 'https://neetcode.io', category: 'DSA', type: 'Link' },
    { _id: '9', title: 'HackerRank', description: 'Practice coding by topics', link: 'https://www.hackerrank.com', category: 'DSA', type: 'Link' },
    { _id: '10', title: 'Prep SGY', description: 'MIT courses, Striver sheet, Algorithms GitHub', link: 'https://prep.sgy.co.in/', category: 'Core Subjects', type: 'Link' },
    { _id: '11', title: 'GitHub Placement Prep', description: 'Open source DSA sheets and interview Qs', link: 'https://github.com/topics/placement-preparation', category: 'DSA', type: 'Link' },
    { _id: '12', title: 'IndiaBIX', description: 'Aptitude, logical, and verbal reasoning', link: 'https://www.indiabix.com', category: 'Aptitude', type: 'Link' },
    { _id: '13', title: 'CareerRide', description: 'Aptitude and technical interview prep', link: 'https://www.careerride.com', category: 'Aptitude', type: 'Link' },
    { _id: '14', title: 'Sawaal', description: 'General knowledge and aptitude practice', link: 'https://www.sawaal.com', category: 'Aptitude', type: 'Link' },
    { _id: '15', title: 'Testbook', description: 'Mock tests and competitive exam prep', link: 'https://www.testbook.com', category: 'Aptitude', type: 'Link' },
    { _id: '16', title: 'InterviewBit', description: 'Interactive coding and interview prep', link: 'https://www.interviewbit.com', category: 'DSA', type: 'Link' },
    { _id: '17', title: 'Pramp', description: 'Free peer-to-peer mock interviews', link: 'https://www.pramp.com', category: 'Company Specific', type: 'Video' },
    { _id: '18', title: 'Glassdoor', description: 'Company reviews and interview experiences', link: 'https://www.glassdoor.co.in', category: 'Company Specific', type: 'Link' },
    { _id: '19', title: 'ByteByteGo', description: 'System design interview prep', link: 'https://www.bytebytego.com', category: 'Core Subjects', type: 'Link' },
    { _id: '20', title: 'CoCubes', description: 'Real company mock exams and assessments', link: 'https://www.cocubes.com', category: 'Aptitude', type: 'Link' },
    { _id: '21', title: 'AMCAT', description: 'Employability assessment and mock tests', link: 'https://www.amcatonline.com', category: 'Aptitude', type: 'Link' },
    { _id: '22', title: 'Mettl', description: 'Online assessment and talent measurement', link: 'https://mettl.com', category: 'Aptitude', type: 'Link' },
    { _id: '23', title: 'TCS NQT Prep', description: 'Company specific prep for TCS', link: 'https://prepinsta.com/tcs-nqt', category: 'Company Specific', type: 'Link' },
    { _id: '24', title: 'Accenture Prep', description: 'Company specific prep for Accenture', link: 'https://prepinsta.com/accenture', category: 'Company Specific', type: 'Link' },
    { _id: '25', title: 'Infosys Prep', description: 'Company specific prep for Infosys', link: 'https://prepinsta.com/infosys', category: 'Company Specific', type: 'Link' },
    { _id: '26', title: 'ISE Placement Resources', description: 'OS, DBMS notes and DSA sheets', link: 'https://linktr.ee/ISE_Placements_Resources', category: 'Core Subjects', type: 'PDF' }
  ];

  const categories = ['All', 'DSA', 'Web Dev', 'Core Subjects', 'Aptitude', 'Company Specific'];

  const filteredResources = STATIC_RESOURCES.filter(r => 
    (filter === 'All' || r.category === filter) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) ||
     r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const getIcon = (type) => {
    switch(type) {
      case 'Video': return <Video className="text-rose-400" />;
      case 'PDF': return <FileText className="text-amber-400" />;
      case 'Cheatsheet': return <Book className="text-emerald-400" />;
      default: return <ExternalLink className="text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Resource Library</h1>
          <p className="text-slate-400 mt-2">Curated study materials, playlists, and cheatsheets.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:border-primary outline-none min-w-[250px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3">
            <Filter size={18} className="text-slate-500" />
            <select 
              className="bg-transparent text-slate-300 py-2 outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, i) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                      {getIcon(resource.type)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-400 rounded">
                      {resource.category}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Visit Resource
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500">
              No resources found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
