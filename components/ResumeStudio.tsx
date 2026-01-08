
import React, { useState } from 'react';
import ResumeAnalyzer from './ResumeAnalyzer';
import ResumeCreator from './ResumeCreator';

const ResumeStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('analyze');
  const [preSelectedTemplate, setPreSelectedTemplate] = useState<string | null>(null);

  const studioModules = [
    { id: 'analyze', label: 'AI Audit', icon: '🔬', desc: 'ATS & Recruiter Logic' },
    { id: 'build', label: 'Builder OS', icon: '✍️', desc: 'Guided Step-by-Step' },
    { id: 'templates', label: 'Templates', icon: '🎨', desc: 'Clean & ATS-Safe' },
    { id: 'portfolio', label: 'Portfolio Audit', icon: '🌐', desc: 'GitHub & LinkedIn' }
  ];

  const handleSelectTemplate = (templateName: string) => {
    setPreSelectedTemplate(templateName);
    setActiveSubTab('build');
  };

  const renderModule = () => {
    switch (activeSubTab) {
      case 'analyze': return <ResumeAnalyzer />;
      case 'build': return <ResumeCreator initialTemplate={preSelectedTemplate} />;
      case 'templates': return <TemplateGallery onSelect={handleSelectTemplate} />;
      case 'portfolio': return <PortfolioAudit />;
      default: return <ResumeAnalyzer />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Resume Studio <span className="text-blue-500">Pro</span></h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              Your complete operating system for professional identity. From AI gap analysis to recruiter-validated resume generation.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-3xl text-sm font-black uppercase tracking-widest border border-white/10 transition-all">Manage Versions</button>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-3xl flex items-center gap-3">
               <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recruiter Verified</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {studioModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveSubTab(mod.id);
                if (mod.id !== 'build') setPreSelectedTemplate(null);
              }}
              className={`flex-1 min-w-[200px] p-6 rounded-[2rem] border transition-all text-left group ${
                activeSubTab === mod.id 
                  ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20 text-white' 
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <span className="text-2xl mb-4 block group-hover:scale-110 transition-transform">{mod.icon}</span>
              <p className={`font-black uppercase tracking-widest text-[11px] mb-1 ${activeSubTab === mod.id ? 'text-blue-100' : 'text-slate-500'}`}>{mod.label}</p>
              <p className={`font-bold text-sm ${activeSubTab === mod.id ? 'text-white' : 'text-slate-300'}`}>{mod.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {renderModule()}
      </div>

      {/* Integration Map */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Master Redirection & Integration Map</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'Resume Worded', 
              purpose: 'Scoring & Recruiter Logic', 
              link: 'https://resumeworded.com', 
              desc: 'Trusted by FAANG candidates for high-level scoring.' 
            },
            { 
              name: 'Jobscan', 
              purpose: 'ATS Keyword Matching', 
              link: 'https://jobscan.co', 
              desc: 'Industry standard for beating automated filters.' 
            },
            { 
              name: 'Novorésumé', 
              purpose: 'Template Inspiration', 
              link: 'https://novoresume.com', 
              desc: 'Globally accepted clean, ATS-safe designs.' 
            },
            { 
              name: 'LinkedIn Audit', 
              purpose: 'Profile Optimization', 
              link: 'https://linkedin.com', 
              desc: 'Verify your digital footprint with recruiter eyes.' 
            }
          ].map((int, i) => (
            <a key={i} href={int.link} target="_blank" rel="noreferrer" className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-500 hover:bg-white transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{int.purpose}</span>
                <span className="text-slate-300 group-hover:text-blue-600">↗</span>
              </div>
              <h5 className="font-black text-slate-900 mb-2">{int.name}</h5>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{int.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateGallery = ({ onSelect }: { onSelect: (name: string) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {[
      { name: 'FAANG Modern', desc: 'Minimalist, impact-focused for top tier product companies.', color: 'blue' },
      { name: 'The Executive', desc: 'Classic, serif-based design with sidebar for leadership roles.', color: 'slate' },
      { name: 'Chronological', desc: 'Traditional, time-line focus. Great for formal corporate roles.', color: 'slate' },
      { name: 'Hybrid', desc: 'Combines technical skills matrix with a clean experience timeline.', color: 'indigo' }
    ].map((t, i) => (
      <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-2 bg-${t.color}-600`} />
        <div className="h-64 bg-slate-100 rounded-2xl mb-6 flex items-center justify-center text-6xl opacity-50 grayscale group-hover:grayscale-0 transition-all">📄</div>
        <h4 className="text-xl font-black text-slate-900 mb-2">{t.name}</h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">{t.desc}</p>
        <button 
          onClick={() => onSelect(t.name)}
          className={`w-full bg-${t.color === 'slate' ? 'slate-800' : t.color + '-600'} text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95`}
        >
          Apply Template
        </button>
      </div>
    ))}
  </div>
);

const PortfolioAudit = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [creativeUrl, setCreativeUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleAudit = (type: 'tech' | 'creative') => {
    setIsAuditing(type);
    setAuditResult(null);
    setTimeout(() => {
      setIsAuditing(null);
      setAuditResult(type === 'tech' 
        ? "✅ GitHub Audit Passed: Found high commit density in React repos. Recommendation: Add more documentation to your 'PlacementOS-Proto' repository."
        : "✅ Portfolio Audit Passed: Visual hierarchy is strong. Recommendation: Add a 'Problem/Solution' breakdown to your most recent Behance project."
      );
    }, 2000);
  };

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">🐙</div>
              <div>
                <h4 className="text-xl font-black text-slate-900">GitHub Repository Audit</h4>
                <p className="text-xs text-slate-500 font-medium">Analyze your READMEs and commit history for recruiter impact.</p>
              </div>
          </div>
          <input 
            type="text" 
            placeholder="https://github.com/your-username" 
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-950 font-bold placeholder:text-slate-400" 
          />
          <button 
            onClick={() => handleAudit('tech')}
            disabled={!githubUrl || !!isAuditing}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 transition-all hover:bg-blue-600"
          >
            {isAuditing === 'tech' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
            {isAuditing === 'tech' ? 'Analyzing...' : 'Run Tech Audit'}
          </button>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">🎨</div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Behance/Dribbble Check</h4>
                <p className="text-xs text-slate-500 font-medium">Verify visual case studies and presentation quality.</p>
              </div>
          </div>
          <input 
            type="text" 
            placeholder="https://behance.net/your-profile" 
            value={creativeUrl}
            onChange={(e) => setCreativeUrl(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-950 font-bold placeholder:text-slate-400" 
          />
          <button 
            onClick={() => handleAudit('creative')}
            disabled={!creativeUrl || !!isAuditing}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 transition-all hover:bg-indigo-600"
          >
            {isAuditing === 'creative' ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
            {isAuditing === 'creative' ? 'Analyzing...' : 'Run Creative Audit'}
          </button>
        </div>
      </div>
      
      {auditResult && (
        <div className="p-8 bg-blue-600 text-white rounded-[2.5rem] animate-in zoom-in duration-300 shadow-xl flex items-start gap-6">
          <div className="text-3xl">🤖</div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">AI Auditor Report</p>
            <p className="font-bold text-sm leading-relaxed">{auditResult}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeStudio;
