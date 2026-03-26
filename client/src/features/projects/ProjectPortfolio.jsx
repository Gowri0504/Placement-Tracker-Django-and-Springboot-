import React, { useEffect, useState } from 'react';
import { FiGithub, FiGlobe, FiPlus, FiTrash2, FiEdit, FiSave, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProjectPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    confidenceScore: 70
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      techStack: typeof formData.techStack === 'string' 
        ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : formData.techStack
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      fetchProjects();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      confidenceScore: project.confidenceScore
    });
    setEditingId(project._id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: '',
      confidenceScore: 70
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Project Portfolio</h1>
          <p className="text-slate-400 mt-2">Manage your projects and interview readiness.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <FiPlus /> Add Project
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="p-6 border-primary/30 bg-primary/5">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Project Title</label>
                <input
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-primary"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Tech Stack (comma separated)</label>
                <input
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-primary"
                  value={formData.techStack}
                  onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
              <textarea
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-primary h-24"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">GitHub Repo URL</label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-primary"
                  value={formData.githubLink}
                  onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Live Demo URL</label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-primary"
                  value={formData.liveLink}
                  onChange={e => setFormData({ ...formData, liveLink: e.target.value })}
                  placeholder="https://project.vercel.app"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase">Interview Confidence</label>
                <span className="text-primary font-bold">{formData.confidenceScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                value={formData.confidenceScore}
                onChange={e => setFormData({ ...formData, confidenceScore: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <FiSave className="mr-2" /> {editingId ? 'Update Project' : 'Create Project'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm} className="px-6">
                <FiX className="mr-2" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project._id} className="group hover:border-primary/50 transition-colors relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(project)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
                <FiEdit size={14} />
              </button>
              <button onClick={() => handleDelete(project._id)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10">
                <FiTrash2 size={14} />
              </button>
            </div>

            <div className="flex justify-between items-start pr-16">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <div className="flex gap-2">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white p-1" title="GitHub Repository">
                    <FiGithub size={20} />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white p-1" title="Live Demo">
                    <FiGlobe size={20} />
                  </a>
                )}
              </div>
            </div>
            
            <p className="text-slate-400 mt-3 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-800">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-slate-500">Interview Confidence</span>
                <span className="text-primary">{project.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.confidenceScore}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                />
              </div>
            </div>
          </Card>
        ))}
        
        {!isAdding && projects.length === 0 && (
          <button 
            onClick={() => setIsAdding(true)}
            className="col-span-full border-2 border-dashed border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 hover:border-slate-600 hover:text-slate-300 transition-all bg-slate-900/20"
          >
            <FiPlus size={48} className="mb-4 opacity-30" />
            <h3 className="text-lg font-bold mb-1">Add your first project</h3>
            <p className="text-sm">Showcase your skills with real-world applications.</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectPortfolio;
