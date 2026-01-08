
import React, { useState, useEffect } from 'react';

const PlacementEngine: React.FC = () => {
  const [activeSection, setActiveSection] = useState('paths');
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  useEffect(() => {
    setIsSectionLoading(true);
    const timer = setTimeout(() => {
      setIsSectionLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const engineModules = [
    { id: 'paths', label: 'Learning Paths', icon: '🛣️' },
    { id: 'company', label: 'Company Roadmaps', icon: '🏢' },
    { id: 'assess', label: 'Assessment Arena', icon: '📝' },
    { id: 'tree', label: 'Skill Tree', icon: '🌳' },
    { id: 'peers', label: 'Peer Groups', icon: '👥' }
  ];

  const handleAchievementRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  const ModuleLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-white/50 rounded-[3rem] border border-slate-100 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600/10 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        Initializing Neural Link...
      </p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Industry Validated</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Placement Engine <span className="text-blue-600">OS</span></h2>
          <p className="text-slate-500 text-lg font-medium">Your Complete Skill → Company → Placement System</p>
        </div>
        
        {/* Updated Navigation - No Scroll, Single Line */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto overflow-hidden">
           <div className="flex w-full flex-nowrap justify-between gap-1 overflow-x-hidden scrollbar-hide">
             {engineModules.map(mod => (
               <button
                 key={mod.id}
                 onClick={() => setActiveSection(mod.id)}
                 className={`px-3 xl:px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap flex items-center gap-2 flex-1 justify-center ${
                   activeSection === mod.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 <span className="text-sm xl:text-base">{mod.icon}</span>
                 <span className="hidden xl:inline">{mod.label}</span>
                 <span className="inline xl:hidden">{mod.label.split(' ')[0]}</span>
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 min-h-[700px] relative">
          {isSectionLoading ? (
            <ModuleLoader />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeSection === 'paths' && <LearningPathGrid />}
              {activeSection === 'company' && <CompanyRoadmapGrid />}
              {activeSection === 'assess' && <AssessmentArena />}
              {activeSection === 'tree' && <SkillTreeDetails />}
              {activeSection === 'peers' && <PeerLearningGrid />}
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-24 -mt-24"></div>
             <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center justify-between">
               Achievements
               <span className="text-[10px] text-blue-400">4 / 6</span>
             </h3>
             <div className="space-y-4">
               {[
                 { title: 'First Steps', rarity: 'Common', status: '✅ Unlocked', link: 'https://www.linkedin.com/learning/' },
                 { title: 'Code Warrior', rarity: 'Rare', status: '✅ Unlocked', link: 'https://www.credly.com/' },
                 { title: 'Speed Demon', rarity: 'Epic', status: '✅ Unlocked', link: 'https://www.credly.com/' },
                 { title: 'Master Mind', rarity: 'Legendary', status: '⏳ 75%', link: 'https://www.linkedin.com/' },
               ].map((ach, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors" onClick={() => handleAchievementRedirect(ach.link)}>
                   <div>
                     <p className="font-bold text-xs">{ach.title}</p>
                     <p className="text-[8px] text-slate-500 font-black uppercase">{ach.rarity}</p>
                   </div>
                   <span className="text-[9px] font-black uppercase text-blue-400">{ach.status}</span>
                 </div>
               ))}
               <button onClick={() => window.open('https://www.credly.com/', '_blank')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Claim Credentials</button>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🏆</div>
                <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase">Readiness Score</h3>
              </div>
              <div className="text-5xl font-black text-emerald-600">94%</div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Top 5% candidate for Microsoft & Google.</p>
              <button onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/', '_blank')} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">Share Report</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const LearningPathGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { title: 'Full Stack Web', icon: '💻', desc: 'React, Node, DBs.', link: 'https://www.freecodecamp.org/' },
      { title: 'Data Science & ML', icon: '📊', desc: 'Python, Algorithms.', link: 'https://www.kaggle.com/' },
      { title: 'Mobile Apps', icon: '📱', desc: 'React Native, Flutter.', link: 'https://docs.expo.dev/' },
      { title: 'Cloud & DevOps', icon: '☁️', desc: 'AWS, Docker, K8s.', link: 'https://explore.skillbuilder.aws/' },
      { title: 'UI/UX Design', icon: '🎨', desc: 'Figma, Research.', link: 'https://help.figma.com/' },
      { title: 'Cybersecurity', icon: '🛡️', desc: 'Hacking, Compliance.', link: 'https://tryhackme.com/' },
    ].map((path, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all group flex flex-col justify-between">
         <div>
           <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">{path.icon}</div>
           <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">{path.title}</h4>
           <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{path.desc}</p>
         </div>
         <button 
           onClick={() => window.open(path.link, '_blank')}
           className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors"
         >
           Continue →
         </button>
      </div>
    ))}
  </div>
);

const CompanyRoadmapGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { name: 'Google', logo: '🔵', roles: 8, time: '6-8m', link: 'https://leetcode.com/company/google/' },
      { name: 'Amazon', logo: '🟠', roles: 12, time: '5-7m', link: 'https://leetcode.com/company/amazon/' },
      { name: 'Microsoft', logo: '🟢', roles: 10, time: '4-6m', link: 'https://learn.microsoft.com/' },
      { name: 'Infosys', logo: '🔷', roles: 6, time: '2-3m', link: 'https://infyspringboard.onwingspan.com/' },
      { name: 'TCS', logo: '🔵', roles: 8, time: '2-4m', link: 'https://learning.tcsionhub.in/' },
      { name: 'Wipro', logo: '🟣', roles: 7, time: '3-5m', link: 'https://www.hackerrank.com/wipro' },
    ].map((co, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all group">
         <div className="flex items-center gap-4 mb-6">
           <div className="text-3xl bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center">{co.logo}</div>
           <div>
             <h4 className="text-xl font-black text-slate-900 leading-tight">{co.name}</h4>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Hub</p>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-2 mb-6 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Roles</p>
              <p className="text-xs font-black text-slate-900">{co.roles}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Time</p>
              <p className="text-[9px] font-black text-blue-600">{co.time}</p>
            </div>
         </div>
         <button onClick={() => window.open(co.link, '_blank')} className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Access Matrix</button>
      </div>
    ))}
  </div>
);

const AssessmentArena = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { title: 'Quant Aptitude', qs: 50, time: '60m', type: 'Aptitude', link: 'https://www.indiabix.com/' },
      { title: 'DS & Algorithms', qs: 40, time: '90m', type: 'Technical', link: 'https://leetcode.com/' },
      { title: 'English Proficiency', qs: 60, time: '45m', type: 'Comm', link: 'https://www.britishcouncil.org/' },
      { title: 'JS Code Challenge', qs: 25, time: '120m', type: 'Coding', link: 'https://codesignal.com/' },
    ].map((a, i) => (
      <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group">
         <div className="space-y-6">
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">{a.type}</span>
           <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{a.title}</h4>
           <div className="flex items-center gap-6 text-[11px] text-slate-500 font-black uppercase tracking-tight">
             <span>📋 {a.qs} Qs</span>
             <span>⏱️ {a.time}</span>
           </div>
           <button onClick={() => window.open(a.link, '_blank')} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Start External Hub</button>
         </div>
      </div>
    ))}
  </div>
);

const SkillTreeDetails = () => (
  <div className="space-y-8">
    <div className="bg-blue-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
      <div className="space-y-2">
        <h3 className="text-2xl font-black">Skill Dependency Engine</h3>
        <p className="text-blue-100 text-sm font-medium">Map your progress through the tree.</p>
      </div>
      <button onClick={() => window.open('https://roadmap.sh', '_blank')} className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest">View Map →</button>
    </div>
    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
       <div className="flex items-center gap-6 mb-10">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">L1</div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Foundation Synthesis</h3>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Programming basics', 'Data Structures', 'Algorithms'].map((s, j) => (
            <div key={j} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-800">{s}</span>
                <span className="text-[10px] font-black text-blue-600">{j === 2 ? '65%' : '100%'}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-600 transition-all duration-1000" style={{width: j === 2 ? '65%' : '100%'}}></div>
              </div>
            </div>
          ))}
       </div>
    </div>
  </div>
);

const PeerLearningGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { title: 'React Developers', members: 156, link: 'https://discord.com' },
      { title: 'Data Science Hub', members: 203, link: 'https://discord.com' },
      { title: 'Interview Warriors', members: 342, link: 'https://peerlist.io' },
      { title: 'Cloud Enthusiasts', members: 128, link: 'https://discord.com' },
    ].map((p, i) => (
      <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group">
         <div>
            <h4 className="text-2xl font-black text-slate-900 mb-6">{p.title}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{p.members} active members</p>
         </div>
         <button onClick={() => window.open(p.link, '_blank')} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Join Cluster →</button>
      </div>
    ))}
  </div>
);

export default PlacementEngine;
