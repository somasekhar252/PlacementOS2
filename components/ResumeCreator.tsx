
import React, { useState, useEffect } from 'react';
import { generateRecruiterResume } from '../services/geminiService';
import { api } from '../services/api';

interface ResumeCreatorProps {
  initialTemplate?: string | null;
}

type SectionKey = 'summary' | 'skills' | 'experience' | 'education';

const ResumeCreator: React.FC<ResumeCreatorProps> = ({ initialTemplate }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ 
    name: '', 
    skills: '', 
    experience: '', 
    education: '', 
    target: '' 
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
<<<<<<< HEAD
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'The Scholar');
  
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(['summary', 'education', 'experience', 'skills']);
=======
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'FAANG Modern');
  
  // Section ordering state
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(['summary', 'skills', 'experience', 'education']);
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe

  useEffect(() => {
    const prefill = async () => {
      try {
        const profile = await api.get('/profile');
        if (profile) {
          setDetails(prev => ({
            ...prev,
            name: profile.name || profile.fullName || '',
            target: profile.careerGoal || '',
            skills: Array.isArray(profile.keySkills) ? profile.keySkills.join(', ') : (profile.skills || ''),
            experience: profile.projects || '',
            education: `${profile.branch || ''} ${profile.college || ''} ${profile.graduationYear || ''}`.trim()
          }));
        }
      } catch (err) {
        console.warn("Pre-fill skipped");
      }
    };
    prefill();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const timeout = setTimeout(() => {
      if (isGenerating) {
        setIsGenerating(false);
<<<<<<< HEAD
        setError("Synthesis timed out. The AI model is currently under high load.");
=======
        setError("Synthesis timed out. The AI model is currently under high load. Please try again.");
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
      }
    }, 25000);

    try {
      const result = await generateRecruiterResume(details, activeTemplate);
      clearTimeout(timeout);
      
      if (result && result.header && result.summary) {
        setResumeData(result);
      } else {
<<<<<<< HEAD
        throw new Error("Incomplete synthesis. Please provide more detail.");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setError(err.message || 'Synthesis failed.');
=======
        throw new Error("Incomplete synthesis. Ensure your inputs provide enough professional detail.");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setError(err.message || 'Synthesis failed. Try shortening your descriptions.');
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
    } finally {
      setIsGenerating(false);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `${details.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf?.().from(element).set(opt).save();
  };

<<<<<<< HEAD
  // Mimics the LaTeX style from images
  const renderScholarTemplate = (data: any) => (
    <div className="bg-white p-16 shadow-2xl min-h-[1050px] text-slate-950 font-serif leading-tight">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-normal mb-1">{data.header?.name}</h1>
        <div className="flex justify-center items-center gap-2 text-[11px] font-medium text-slate-800">
          <span>{data.header?.contact}</span>
        </div>
      </div>

      <div className="space-y-6">
        {sectionOrder.map((key) => {
          switch (key) {
            case 'summary':
              return (
                <section key="summary">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest border-b border-slate-900 pb-0.5 mb-2">Profile Summary</h4>
                  <ul className="list-disc pl-5">
                    <li className="text-[12px] leading-relaxed">{data.summary}</li>
                  </ul>
                </section>
              );
            case 'education':
              return (
                <section key="education">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest border-b border-slate-900 pb-0.5 mb-2">Education</h4>
                  <div className="space-y-2">
                    {data.education?.map((edu: string, idx: number) => {
                      const parts = edu.split('|').map(s => s.trim());
                      return (
                        <div key={idx} className="flex justify-between items-start text-[12px]">
                          <div className="flex-1">
                            <p className="font-bold">{parts[0] || edu}</p>
                            <p className="italic">{parts[1] || ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{parts[2] || ''}</p>
                            <p className="italic">{parts[3] || ''}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            case 'experience':
              return (
                <section key="experience">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest border-b border-slate-900 pb-0.5 mb-2">Projects</h4>
                  <div className="space-y-4">
                    {data.experience?.map((exp: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <p className="text-[12px]"><span className="font-bold">{exp.role}</span> | <span className="italic">{exp.company}</span></p>
                          <span className="text-[12px] italic">{exp.duration}</span>
                        </div>
                        <ul className="list-disc pl-5 mt-1 space-y-0.5">
                          {exp.achievements?.map((a: string, j: number) => (
                            <li key={j} className="text-[11px] leading-relaxed">{a}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            case 'skills':
              return (
                <section key="skills">
                  <h4 className="text-[13px] font-bold uppercase tracking-widest border-b border-slate-900 pb-0.5 mb-2">Skills</h4>
                  <div className="text-[12px] space-y-1">
                    <p><span className="font-bold">Technical Stack:</span> {data.skills?.join(', ')}</p>
                  </div>
                </section>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );

  const renderFAANGTemplate = (data: any) => (
    <div className="bg-white p-12 shadow-2xl min-h-[1050px] text-slate-900 font-sans border-t-[12px] border-blue-600">
      <div className="text-center border-b border-slate-200 pb-8 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">{data.header?.name}</h1>
        <p className="text-blue-600 font-bold text-lg mt-1">{data.header?.title}</p>
        <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-widest">{data.header?.contact}</p>
      </div>
      <div className="space-y-10">
        {sectionOrder.map(key => {
          if (key === 'summary') return (
             <section key={key}>
               <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Professional Summary</h4>
               <p className="text-sm text-slate-700 leading-relaxed font-medium">{data.summary}</p>
             </section>
          );
          if (key === 'skills') return (
            <section key={key}>
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Technical Stack</h4>
=======
  const renderOrderedSections = (data: any, theme: { accent: string, text: string }) => {
    return sectionOrder.map((key) => {
      switch (key) {
        case 'summary':
          return (
            <section key="summary" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking-widest border-b border-slate-100 pb-2 mb-4`}>Professional Overview</h4>
              <p className={`text-sm ${theme.text} leading-relaxed font-medium`}>{data.summary}</p>
            </section>
          );
        case 'skills':
          return (
            <section key="skills" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking-widest border-b border-slate-100 pb-2 mb-4`}>Technical Proficiencies</h4>
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((s: string) => (
                  <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-md text-slate-700">{s}</span>
                ))}
              </div>
            </section>
          );
<<<<<<< HEAD
          if (key === 'experience') return (
            <section key={key}>
               <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Experience & Projects</h4>
               <div className="space-y-6">
=======
        case 'experience':
          return (
            <section key="experience" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking-widest border-b border-slate-100 pb-2 mb-4`}>Impact & Experience</h4>
              <div className="space-y-6">
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
                {data.experience?.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h5 className="font-black text-slate-900 text-sm">{exp.role}</h5>
                      <span className="text-[10px] font-black text-slate-400">{exp.duration}</span>
                    </div>
<<<<<<< HEAD
                    <p className="text-xs font-black text-blue-600 mb-3">{exp.company}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {exp.achievements?.map((a: string, j: number) => (
                        <li key={j} className="text-xs text-slate-700 leading-relaxed font-medium">{a}</li>
=======
                    <p className={`text-xs font-black text-${theme.accent} mb-3`}>{exp.company}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {exp.achievements?.map((a: string, j: number) => (
                        <li key={j} className={`text-xs ${theme.text} leading-relaxed font-medium`}>{a}</li>
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
                      ))}
                    </ul>
                  </div>
                ))}
<<<<<<< HEAD
               </div>
            </section>
          );
          if (key === 'education') return (
            <section key={key}>
               <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Education</h4>
               {data.education?.map((edu: string, i: number) => (
                 <p key={i} className="text-xs font-bold text-slate-700 mb-1">{edu}</p>
               ))}
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );

  if (resumeData) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 animate-in fade-in zoom-in-95 duration-500 pb-12">
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-[#0B1224] p-8 rounded-[2.5rem] text-white shadow-2xl space-y-8 sticky top-24">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Layout Engine</p>
              <h3 className="text-xl font-black">Design Terminal</h3>
            </div>
            
            <div className="space-y-4">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Templates</p>
               <select 
                 value={activeTemplate}
                 onChange={(e) => setActiveTemplate(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
               >
                 <option>The Scholar</option>
                 <option>FAANG Modern</option>
                 <option>The Executive</option>
                 <option>Chronological</option>
                 <option>Hybrid</option>
               </select>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Section Order</p>
              <div className="space-y-2">
                {sectionOrder.map((key, i) => (
                  <div key={key} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800 group hover:border-slate-600 transition-all">
                    <span className="text-[10px] font-black uppercase text-slate-300">{key}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveSection(i, 'up')} disabled={i === 0} className="p-1.5 hover:bg-slate-800 rounded-lg text-xs disabled:opacity-20">↑</button>
                      <button onClick={() => moveSection(i, 'down')} disabled={i === sectionOrder.length - 1} className="p-1.5 hover:bg-slate-800 rounded-lg text-xs disabled:opacity-20">↓</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button onClick={handleDownloadPDF} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">Export PDF</button>
              <button onClick={() => setResumeData(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Back to Editor</button>
            </div>
          </div>
        </div>

        <div id="resume-content" className="flex-1 shadow-2xl bg-white max-w-[850px] mx-auto min-h-[1050px]">
          {activeTemplate === 'The Scholar' && renderScholarTemplate(resumeData)}
          {activeTemplate === 'FAANG Modern' && renderFAANGTemplate(resumeData)}
          {activeTemplate === 'The Executive' && <p className="p-20 text-center font-bold">Template Rendering...</p>}
          {activeTemplate === 'Chronological' && <p className="p-20 text-center font-bold">Template Rendering...</p>}
          {activeTemplate === 'Hybrid' && <p className="p-20 text-center font-bold">Template Rendering...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Resume Architect Wizard</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Synthesizing Professional Identity</p>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl animate-in shake duration-500 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-rose-600 text-xs font-bold leading-relaxed">{error}</p>
            </div>
            <button onClick={handleGenerate} className="text-rose-600 text-[10px] font-black uppercase tracking-widest underline">Retry Generation</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Candidate Identity</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                value={details.name} 
                onChange={e => setDetails({...details, name: e.target.value})} 
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Role</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                value={details.target} 
                onChange={e => setDetails({...details, target: e.target.value})} 
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 shadow-lg transition-all hover:bg-blue-600">Next Stage</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Experience & Projects</label>
              <textarea 
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none" 
                value={details.experience} 
                onChange={e => setDetails({...details, experience: e.target.value})} 
                placeholder="List your projects, accomplishments, and impacts..."
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 hover:bg-blue-600 transition-all">Next Stage</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tech Stack</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  placeholder="React, Node.js, AWS, etc." 
                  value={details.skills} 
                  onChange={e => setDetails({...details, skills: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Background</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-950 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  placeholder="University, Degree, Graduation Year" 
                  value={details.education} 
                  onChange={e => setDetails({...details, education: e.target.value})} 
                />
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Back</button>
               <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 shadow-xl hover:bg-blue-700 transition-all"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Synthesizing...</span>
                  </>
                ) : 'Generate Professional Resume'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCreator;
=======
              </div>
            </section>
          );
        case 'education':
          return data.education && (
            <section key="education" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
