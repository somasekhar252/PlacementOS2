import React, { useState } from 'react';
import ResumeAnalyzer from './ResumeAnalyzer';
import ResumeCreator from './ResumeCreator';

const ResumeStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('analyze');

  const studioModules = [
    { id: 'analyze', label: 'AI Audit', icon: '🔬', desc: 'ATS & Recruiter Logic' },
    { id: 'build', label: 'Builder OS', icon: '✍️', desc: 'Guided Step-by-Step' },
    { id: 'portfolio', label: 'Portfolio Audit', icon: '🌐', desc: 'GitHub & LinkedIn' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Resume Studio <span className="text-blue-500">Pro</span></h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium">Complete OS for professional identity. From AI gap analysis to recruiter-validated generation.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {studioModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveSubTab(mod.id)}
              className={`flex-1 min-w-[200px] p-6 rounded-[2rem] border transition-all text-left ${
                activeSubTab === mod.id 
                  ? 'bg-blue-600 border-blue-500 shadow-xl text-white' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-2xl mb-4 block">{mod.icon}</span>
              <p className="font-black uppercase tracking-widest text-[11px] mb-1">{mod.label}</p>
              <p className="font-bold text-sm">{mod.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeSubTab === 'analyze' ? <ResumeAnalyzer /> : <ResumeCreator />}
      </div>
    </div>
  );
};

export default ResumeStudio;
