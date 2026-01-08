import React, { useState, useEffect } from 'react';
import { generateRecruiterResume } from '../services/geminiService';
import { api } from '../services/api';

const ResumeCreator: React.FC<{ initialTemplate?: string | null }> = ({ initialTemplate }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ name: '', skills: '', experience: '', education: '', target: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'The Scholar');
  const [sectionOrder, setSectionOrder] = useState<string[]>(['summary', 'education', 'experience', 'skills']);

  useEffect(() => {
    const prefill = async () => {
      try {
        const profile = await api.get('/profile');
        if (profile) {
          setDetails({
            name: profile.name || profile.fullName || '',
            target: profile.careerGoal || '',
            skills: Array.isArray(profile.keySkills) ? profile.keySkills.join(', ') : (profile.skills || ''),
            experience: profile.projects || '',
            education: `${profile.branch || ''} ${profile.college || ''} ${profile.graduationYear || ''}`.trim()
          });
        }
      } catch (err) { console.warn("Pre-fill skipped"); }
    };
    prefill();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecruiterResume(details, activeTemplate);
      if (result && result.header) { setResumeData(result); }
    } catch (err) { alert('Synthesis failed. Please provide more detail.'); }
    finally { setIsGenerating(false); }
  };

  if (resumeData) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 p-10 bg-slate-50 min-h-screen">
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-[#0B1224] p-8 rounded-[2.5rem] text-white shadow-2xl space-y-8">
            <h3 className="text-xl font-black">Design Terminal</h3>
            <select value={activeTemplate} onChange={(e) => setActiveTemplate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-bold text-white">
              <option>The Scholar</option>
              <option>FAANG Modern</option>
            </select>
            <button onClick={() => setResumeData(null)} className="w-full bg-slate-800 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Back to Editor</button>
          </div>
        </div>
        <div className="flex-1 shadow-2xl bg-white max-w-[850px] mx-auto p-16">
          <h1 className="text-4xl text-center font-normal">{resumeData.header?.name}</h1>
          <p className="text-center text-xs text-slate-500 mt-2">{resumeData.header?.contact}</p>
          <div className="mt-10 space-y-8">
            <section>
              <h4 className="text-[13px] font-bold uppercase tracking-widest border-b pb-1 mb-3">Profile Summary</h4>
              <p className="text-sm leading-relaxed">{resumeData.summary}</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[3rem] border shadow-xl space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">Resume Architect</h2>
          <span className="text-xs font-black text-slate-400 uppercase">Step {step} of 3</span>
        </div>
        {step === 1 && (
          <div className="space-y-6">
            <input className="w-full bg-slate-50 border rounded-2xl p-4 font-bold" placeholder="Full Name" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} />
            <input className="w-full bg-slate-50 border rounded-2xl p-4 font-bold" placeholder="Target Role" value={details.target} onChange={e => setDetails({...details, target: e.target.value})} />
            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest">Next Stage</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <textarea className="w-full h-48 bg-slate-50 border rounded-2xl p-4 font-bold" placeholder="List projects and impacts..." value={details.experience} onChange={e => setDetails({...details, experience: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black uppercase">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase">Next Stage</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <input className="w-full bg-slate-50 border rounded-2xl p-4 font-bold" placeholder="React, Python, AWS, etc." value={details.skills} onChange={e => setDetails({...details, skills: e.target.value})} />
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest">
              {isGenerating ? 'Synthesizing...' : 'Generate Professional Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCreator;
