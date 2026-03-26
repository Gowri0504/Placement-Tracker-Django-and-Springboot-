import React, { useEffect, useState } from 'react';
import { FiCheckSquare, FiPlus, FiSquare, FiTrash2, FiExternalLink, FiX, FiInfo } from 'react-icons/fi';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CompanyTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [resources, setResources] = useState([]);
  const [selectedCatalogName, setSelectedCatalogName] = useState(null);
  const CATALOG = [
    'Soliton Technologies','Mr Cooper','Survey Sparrow (DepOps)','Trustrace','Fourkites','Openminz','TuringAI','Presidio','Cadence','Codingmart',
    'Ajira','Tosibha','Zopsmart','Zoho','Swarmx Advanced Technologies','Thoughtscrest','Gocomet','HFFC','Afford medicals','Cartrabbit',
    'EverestIMS Technologies','Rapiddata','Uhnder','CloseFuture','AMD','Trimble','Zosh Aerospace','BULL Machines','Nallas Technologies','A-thon All-Terrain',
    'MulticoreWare','Delta Electronics India Pvt. Ltd','Ignitarium','Meynikara','Mitsogo','Cloud Assert','Calibraint Technologies','Conserve Solutions','Payoda - B.Sc','Maplelabs(Xoriant)',
    'ITC Food Division','JMAN Group','Conserve Solutions - Trichy','Rubrik','Startoon Labs Pvt.Ltd','TVS Motors','Ethic Secure','KGIS','Schneider Electric','ICT Software',
    'EY','Mistral Solutions','DYNAMIXON Technologies P. Ltd','Green Collar Agritech Solution Pvt.Ltd','Vaag Systems Inc','Workhall','Rapyuta Robotics','Unilogic Technologies','CEI India','Literact fintech',
    'CreamCollar Edu Tech Pvt,Ltd,.','Industrial Air Solutions LLP (KLGi)','AppSentinels.AI','eShips','The Cloud Company','Krisam Automation - Bangalore','CoreEL Technologies','Delphi -TVS','Iam Neo','GE Vernova',
    'Enthu Technologies','Data Patterns (India) Ltd','JGC','Va Tech Wabag','Infosys - Specialist Programmer','Data Pattern - Set 2','Adwik Intellimech','B Fouress Private Limited','Thryv Mobility Pvt. Ltd. @ R2D2-IITM','LTTS',
    'Delphi TVS','LTIMindtree','Tems Tech','Yashika Industries','Titan','Contriver','Aptasolvics','Belsterns Technologies (Intern)','Ligths','Cognizant - GenC Set1',
    'Aarbee Structures','Renault Nissan','ADU Corp','Motherson Automotives','Synapse Robotics','Festo - Bangalore','RSB Arch Project Consultants Pvt. Ltd','Sartime','Fibro Foods','Hunger box'
  ];
  const COMPANY_OPTIONS = [
    'Accenture','Adobe','Amazon','American Express','Atlassian','Barclays','Bloomberg','Bosch','Byju\'s','Cognizant',
    'Capgemini','Cisco','Citrix','Cloudera','Codenation','Deloitte','Deutsche Bank','Directi','Dr. Reddy\'s',
    'Ericsson','Expedia','Flipkart','Goldman Sachs','Google','HCL','HP','IBM','Infosys','Intel','JP Morgan',
    'Larsen & Toubro','LG Soft','LinkedIn','Mahindra Comviva','MakeMyTrip','Microsoft','MindTree','Morgan Stanley',
    'Mu Sigma','Nvidia','Oracle','Ola','PayPal','Paytm','Qualcomm','Sap Labs','Samsung','SAP','Siemens',
    'Tata Consultancy Services','Tech Mahindra','ThoughtWorks','Uber','United Health Group','Vmware','Walmart','Wipro','Zoho'
  ];
  const [formData, setFormData] = useState({
    name: '',
    pattern: '',
    status: 'APPLIED',
    currentRound: 0
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/companies', formData);
      fetchCompanies();
      setIsAdding(false);
      setFormData({ name: '', pattern: '', status: 'APPLIED', currentRound: 0 });
    } catch (err) {
      console.error(err);
      setError('Failed to add company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
      if (selectedCompany?.id === id) setSelectedCompany(null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status, round) => {
    try {
      await api.patch(`/companies/${id}/status`, { status, round });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };
  const generateWebResources = (name) => {
    const q = encodeURIComponent(name);
    return [
      { title: `${name} Interview Experiences (GeeksforGeeks)`, link: `https://www.geeksforgeeks.org/search/?q=${q}%20interview%20experience`, type: 'Article' },
      { title: `${name} Interview Questions (LeetCode Discuss)`, link: `https://leetcode.com/discuss/interview-question?query=${q}`, type: 'Discussion' },
      { title: `${name} Interview Questions (YouTube)`, link: `https://www.youtube.com/results?search_query=${q}+interview+questions`, type: 'Video' },
      { title: `${name} Interview Experiences (Medium)`, link: `https://medium.com/search?q=${q}%20interview%20experience`, type: 'Article' },
      { title: `${name} Interview Prep (Reddit)`, link: `https://www.reddit.com/search/?q=${q}%20interview`, type: 'Discussion' },
      { title: `${name} Interview Questions (InterviewBit Search)`, link: `https://www.interviewbit.com/search/?q=${q}`, type: 'Guide' },
      { title: `${name} Careers`, link: `https://www.google.com/search?q=${q}+careers`, type: 'Careers' }
    ];
  };
  const selectCatalog = (name) => {
    setSelectedCompany(null);
    setSelectedCatalogName(name);
    setResources(generateWebResources(name));
  };

  const toggleChecklist = async (company, index) => {
    const newChecklist = [...company.checklist];
    newChecklist[index].isCompleted = !newChecklist[index].isCompleted;
    try {
      await api.put(`/companies/${company._id}`, { checklist: newChecklist });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Target Companies</h1>
          <p className="text-slate-400 mt-2">Track your dream jobs and preparation status.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <FiPlus /> Add Target
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Company Catalog</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATALOG.map((name, i) => (
            <button 
              key={`${i}-${name}`}
              onClick={() => selectCatalog(name)}
              className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                selectedCatalogName === name ? 'border-primary bg-primary/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-primary/30'
              }`}
              title={name}
            >
              <span className="text-[10px] text-slate-500 mr-2">{i + 1}.</span>{name}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Board */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['APPLIED', 'TECHNICAL_INTERVIEW', 'OFFERED'].map(status => (
            <div key={status} className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
                {status.replace('_', ' ')}
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                  {companies.filter(c => c.status === status).length}
                </span>
              </h3>
              
              {companies.filter(c => c.status === status).map(company => (
                <Card 
                  key={company.id} 
                  className={`p-4 group hover:border-primary/50 transition-all cursor-pointer ${selectedCompany?.id === company.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white">{company.name}</h4>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(company.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-500 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded border font-bold uppercase bg-slate-800 text-slate-400 border-slate-700">
                      Round {company.currentRound}
                    </span>
                    {company.appliedAt && (
                      <span className="text-[10px] text-slate-500">
                        {new Date(company.appliedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 italic">
                    {company.pattern}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
        
        {/* Sidebar: Details & Resources */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedCompany ? (
              <motion.div
                key={selectedCompany.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 sticky top-6"
              >
                <Card className="p-6 border-primary/30">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">{selectedCompany.name}</h2>
                    <button onClick={() => setSelectedCompany(null)} className="text-slate-500 hover:text-white">
                      <FiX />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Current Status</label>
                      <select 
                        value={selectedCompany.status}
                        onChange={(e) => updateStatus(selectedCompany.id, e.target.value, selectedCompany.currentRound)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                      >
                        {['APPLIED', 'ONLINE_TEST', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'OFFERED', 'REJECTED'].map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Current Round</label>
                      <input 
                        type="number"
                        value={selectedCompany.currentRound}
                        onChange={(e) => updateStatus(selectedCompany.id, selectedCompany.status, parseInt(e.target.value))}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                    <FiInfo size={32} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">No Company Selected</h3>
                    <p className="text-sm text-slate-500 mt-1">Select a company from the board to view resources and update status.</p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Target Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Target Company</h2>
                  <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">
                    <FiX />
                  </button>
                </div>
                
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                    <select 
                      required
                      disabled={submitting}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    >
                      <option value="">Select a company...</option>
                      {COMPANY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Pattern / Notes</label>
                    <textarea 
                      disabled={submitting}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                      placeholder="e.g. 2 Technical Rounds + 1 HR"
                      value={formData.pattern}
                      onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    />
                  </div>

                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                  <div className="pt-4 flex gap-3">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1"
                      onClick={() => setIsAdding(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Company'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyTracker;
