import React, { useState } from 'react';
import { matchResumeToJob } from '../services/geminiService';

const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiagnostic = async () => {
    if (!resumeText.trim() || !jobText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await matchResumeToJob(resumeText, jobText);
      setAnalysis(result);
    } catch (err) {
      alert('Neural Audit failed. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <textarea
          className="w-full h-72 bg-white border border-slate-200 rounded-[2rem] p-8 text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          placeholder="Paste Resume Content..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <textarea
          className="w-full h-72 bg-white border border-slate-200 rounded-[2rem] p-8 text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          placeholder="Paste Job Description..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDiagnostic}
          disabled={isLoading || !resumeText || !jobText}
          className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing Architecture...' : 'Audit Readiness 🚀'}
        </button>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 animate-in zoom-in-95">
          <div className="bg-white p-10 rounded-[2.5rem] border text-center shadow-xl">
            <div className="text-5xl font-black text-blue-600">{analysis.matchScore}%</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">ATS Match Score</p>
          </div>
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[2.5rem] text-white">
            <h4 className="font-black uppercase tracking-widest text-blue-400 mb-4 text-xs">Improvement Map</h4>
            <ul className="space-y-3">
              {analysis.improvementSuggestions?.map((s: string, i: number) => (
                <li key={i} className="text-sm text-slate-300 font-medium">✦ {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
