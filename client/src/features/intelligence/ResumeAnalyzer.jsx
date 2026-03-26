import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Search, CheckCircle, AlertTriangle, Lightbulb, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await api.post('/ml/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0f172a', // Match slate-950
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume-Analysis-${new Date().toLocaleDateString()}.pdf`);
    } catch (err) {
      console.error('PDF Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Resume Intelligence...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Resume Intelligence</h1>
        <p className="text-slate-400 mt-2">ATS Score Prediction & AI-Powered Skill Gap Analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-primary" />
            <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
          </div>
          
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-primary">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-white font-bold">{file ? file.name : "Select PDF Resume"}</h3>
                <p className="text-sm text-slate-500 mt-1">Drag and drop or click to upload</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing || !file}
              className="px-8"
            >
              {analyzing ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
              {analyzing ? "AI is Analyzing..." : "Analyze Resume"}
            </Button>
          </div>
        </Card>

        {/* Results Sidebar */}
        <div className="space-y-6">
          {resumeData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-8 text-center bg-primary/5 border-primary/20">
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">ATS Match Score</h3>
                <div className="text-6xl font-display font-black text-primary mb-2">
                  {resumeData.ats_score}%
                </div>
                <p className="text-slate-400 text-sm">{resumeData.message}</p>
              </Card>

              <Card className="p-6 space-y-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  Skills Found
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills_found?.map(s => (
                    <span key={s} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Lightbulb className="text-amber-500" size={18} />
                  Suggested Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.suggested_skills?.map(s => (
                    <span key={s} className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="p-12 text-center border-dashed border-slate-800 bg-transparent">
              <Search className="mx-auto text-slate-700 mb-4" size={32} />
              <p className="text-slate-500 text-sm italic">Analyze your resume to see ATS score and skill gap analysis.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
