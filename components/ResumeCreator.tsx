
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
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'FAANG Modern');
  
  // Section ordering state
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(['summary', 'skills', 'experience', 'education']);

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
        setError("Synthesis timed out. The AI model is currently under high load. Please try again.");
      }
    }, 25000);

    try {
      const result = await generateRecruiterResume(details, activeTemplate);
      clearTimeout(timeout);
      
      if (result && result.header && result.summary) {
        setResumeData(result);
      } else {
        throw new Error("Incomplete synthesis. Ensure your inputs provide enough professional detail.");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setError(err.message || 'Synthesis failed. Try shortening your descriptions.');
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
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((s: string) => (
                  <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-md text-slate-700">{s}</span>
                ))}
              </div>
            </section>
          );
        case 'experience':
          return (
            <section key="experience" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking-widest border-b border-slate-100 pb-2 mb-4`}>Impact & Experience</h4>
              <div className="space-y-6">
                {data.experience?.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h5 className="font-black text-slate-900 text-sm">{exp.role}</h5>
                      <span className="text-[10px] font-black text-slate-400">{exp.duration}</span>
                    </div>
                    <p className={`text-xs font-black text-${theme.accent} mb-3`}>{exp.company}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {exp.achievements?.map((a: string, j: number) => (
                        <li key={j} className={`text-xs ${theme.text} leading-relaxed font-medium`}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        case 'education':
          return data.education && (
            <section key="education" className="transition-all duration-500">
              <h4 className={`text-xs font-black text-${theme.accent} uppercase tracking