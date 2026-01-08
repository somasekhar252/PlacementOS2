import React, { useState, useEffect } from 'react';

const PlacementEngine: React.FC = () => {
  const [activeSection, setActiveSection] = useState('paths');
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  useEffect(() => {
    setIsSectionLoading(true);
    const timer = setTimeout(() => setIsSectionLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const engineModules = [
    { id: 'paths', label: 'Learning Paths', icon: '🛣️' },
    { id: 'company', label: 'Company Roadmaps', icon: '🏢' },
    { id: 'tree', label: 'Skill Tree', icon: '🌳' },
    { id: 'peers', label: 'Peer Groups', icon: '👥' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Placement Engine <span className="text-blue-600">OS</span></h2>
          <p className="text-slate-500 text-lg font-medium">Your Complete Skill → Company → Placement System</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
          {engineModules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveSection(mod.id)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 flex-1 justify-center ${
                activeSection === mod.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{mod.icon}</span>
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 min-h-[500px]">
          {isSectionLoading ? (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-[3rem] border border-slate-100 animate-pulse">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Neural Link...</p>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm h-full">
              <h3 className="text-2xl font-black mb-6">Active Module: {activeSection.toUpperCase()}</h3>
              <p className="text-slate-500">Industry curriculum data and roadmap synthesis active.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6">Readiness Score</h3>
            <div className="text-5xl font-black text-emerald-500">94%</div>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">Top 5% candidate for Microsoft & Google roles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementEngine;
