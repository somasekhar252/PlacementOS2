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
    { id: 'apt-1', title: 'Quantitative Aptitude', desc: 'Master number systems, percentages, and arithmetic reasoning.', qs: 30, time: '45m', type: 'Logic', color: 'blue', difficulty: 'Medium' },
    { id: 'dsa-1', title: 'Technical Core (DSA)', desc: 'In-depth testing on Arrays, Trees, Graphs, and DP patterns.', qs: 30, time: '90m', type: 'Coding', color: 'emerald', difficulty: 'Hard' },
    { id: 'comm-1', title: 'Verbal Ability & EQ', desc: 'Professional communication, grammar, and workplace etiquette.', qs: 30, time: '30m', type: 'Soft Skills', color: 'amber', difficulty: 'Beginner' }
  ];

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filter.toLowerCase()) || 
    j.company.toLowerCase().includes(filter.toLowerCase())
  );

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
           <button onClick={() => setActiveView('jobs')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'jobs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Hiring Gateway</button>
           <button onClick={() => setActiveView('assessments')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'assessments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Assessment Center</button>
        </div>
      </div>

      {activeView === 'jobs' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm">
            <input type="text" placeholder="Filter by role or company..." className="flex-1 bg-transparent outline-none font-medium text-slate-600" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-10 rounded-[3rem] border shadow-sm hover:border-blue-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex gap-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-3xl">🏢</div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-900">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                      <span>{job.company}</span>
                      <span className="text-emerald-600 font-black">{job.salary}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => window.open(job.link, '_blank')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Apply on {job.source}</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((test) => (
            <div key={test.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
              <div>
                <span className={`bg-${test.color}-50 text-${test.color}-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{test.type}</span>
                <h4 className="text-xl font-black text-slate-900 mt-4 mb-3">{test.title}</h4>
                <p className="text-xs text-slate-500 font-medium mb-8">{test.desc}</p>
              </div>
              <button onClick={() => setSelectedAssessment(test)} className="w-full bg-slate-900 group-hover:bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Initialize Assessment</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityHub;
