
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AssessmentCenter from '../pages/AssessmentCenter';

const OpportunityHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'jobs' | 'assessments'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const assessments = [
    { 
      id: 'apt-1', 
      title: 'Quantitative Aptitude', 
      desc: 'Master number systems, percentages, and arithmetic reasoning.', 
      qs: 30, 
      time: '45m', 
      type: 'Logic', 
      color: 'blue',
      difficulty: 'Medium'
    },
    { 
      id: 'dsa-1', 
      title: 'Technical Core (DSA)', 
      desc: 'In-depth testing on Arrays, Trees, Graphs, and DP patterns.', 
      qs: 30, 
      time: '90m', 
      type: 'Coding', 
      color: 'emerald',
      difficulty: 'Hard'
    },
    { 
      id: 'comm-1', 
      title: 'Verbal Ability & EQ', 
      desc: 'Professional communication, grammar, and workplace etiquette.', 
      qs: 30, 
      time: '30m', 
      type: 'Soft Skills', 
      color: 'amber',
      difficulty: 'Beginner'
    },
    { 
      id: 'front-1', 
      title: 'Frontend Specialization', 
      desc: 'React.js, CSS Architecture, and Web Performance metrics.', 
      qs: 30, 
      time: '40m', 
      type: 'Domain', 
      color: 'indigo',
      difficulty: 'Medium'
    },
    { 
      id: 'sql-1', 
      title: 'Database & SQL Logic', 
      desc: 'Query optimization, joins, and database schema design.', 
      qs: 30, 
      time: '25m', 
      type: 'Backend', 
      color: 'rose',
      difficulty: 'Medium'
    },
    { 
      id: 'psy-1', 
      title: 'Psychometric Analysis', 
      desc: 'Personality assessment for culture-fit at top tech firms.', 
      qs: 30, 
      time: '20m', 
      type: 'Culture', 
      color: 'slate',
      difficulty: 'Beginner'
    }
  ];

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filter.toLowerCase()) || 
    j.company.toLowerCase().includes(filter.toLowerCase())
  );

  // If a user chooses to initialize an assessment, we show the full assessment engine
  if (selectedAssessment) {
    return (
      <AssessmentCenter 
        activeAssessment={selectedAssessment} 
        onBack={() => setSelectedAssessment(null)} 
      />
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Opportunity Hub</h2>
          <p className="text-slate-500 text-lg font-medium">AI-matched jobs + real assessments + readiness insights</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveView('jobs')}
             className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'jobs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Hiring Gateway
           </button>
           <button 
             onClick={() => setActiveView('assessments')}
             className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'assessments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Assessment Center
           </button>
        </div>
      </div>

      {activeView === 'jobs' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-slate-100 rounded-2xl">🔍</div>
            <input 
              type="text" 
              placeholder="Filter by role, skills, or company..." 
              className="flex-1 bg-transparent outline-none font-medium text-slate-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {loading ? (
             <div className="grid grid-cols-1 gap-6">
               {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[3rem]"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                  <p className="text-slate-500 font-bold italic">No matching opportunities found. Try adjusting your filter.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-10 group">
                    <div className="flex gap-8">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">🏢</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <h4 className="text-2xl font-black text-slate-900 leading-tight">{job.title}</h4>
                          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                            🧠 {job.matchScore}% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                          <span>{job.company}</span>
                          <span>📍 {job.location}</span>
                          <span className="text-emerald-600 font-black">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[240px]">
                      <button 
                        onClick={() => window.open(job.link, '_blank')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        Apply on {job.source}
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-blue-600 p-10 rounded-[3rem] text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="space-y-4 relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Global Ranking</span>
                <h3 className="text-3xl font-black">Elite Certification Series</h3>
                <p className="text-blue-100 text-sm font-medium max-w-md">Complete high-stakes assessments to unlock "Verified Elite" badges for top-tier product company recruiters.</p>
              </div>
              <div className="text-right relative z-10 hidden md:block">
                 <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Current Standing</p>
                 <p className="text-5xl font-black">Top 4%</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Badges Earned</p>
               <div className="flex justify-center gap-2 mb-4">
                 <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-sm border border-emerald-100">🏆</span>
                 <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-sm border border-blue-100">💻</span>
                 <span className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100 border-dashed">🔒</span>
               </div>
               <p className="text-xs font-black text-slate-900 uppercase">3 More to Level Up</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((test) => (
              <div key={test.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`bg-${test.color}-50 text-${test.color}-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>
                      {test.type}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active session</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{test.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{test.desc}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-2">⏱️ {test.time}</span>
                    <span className="flex items-center gap-2">📄 {test.qs} Questions</span>
                  </div>
                  <button 
                    onClick={() => setSelectedAssessment(test)}
                    className="w-full bg-slate-900 group-hover:bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                  >
                    Initialize Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border border-dashed border-slate-200 text-center">
             <p className="text-slate-400 font-bold italic text-sm">More specialized assessments are synthesized weekly based on market demand.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityHub;
