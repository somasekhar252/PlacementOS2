import React from 'react';
import { auth, signOut } from '../firebase.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLocked?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isLocked }) => {
  const user = auth.currentUser;
  
  const menuGroups = [
    {
      title: "Command Center",
      items: [{ id: 'dashboard', label: 'Career Command', icon: '📊' }]
    },
    {
      title: "Employability Stack",
      items: [
        { id: 'resume', label: 'Resume Studio', icon: '🧠' },
        { id: 'placement', label: 'Placement Engine', icon: '🚀' },
        { id: 'interviews', label: 'Interview Arena', icon: '🎯' },
      ]
    },
    {
      title: "Market Intelligence",
      items: [
        { id: 'jobs', label: 'Opportunity Hub', icon: '💼' },
        { id: 'profile', label: 'My Profile', icon: '👤' },
        { id: 'assistant', label: 'AI Strategy Coach', icon: '✨' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="w-72 bg-[#0F172A] text-slate-400 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl">P</div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">PlacementOS</h1>
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Industry Validated</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto py-4 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{group.title}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const locked = isLocked && item.id !== 'profile';
                  return (
                    <button
                      key={item.id}
                      disabled={locked}
                      onClick={() => !locked && setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white shadow-xl' 
                          : locked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{locked ? '🔒' : item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={() => signOut()} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-500 hover:text-white flex items-center gap-3">
            <span>🚪</span> Logout Terminal
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col bg-[#F8FAFC]">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-900">{user?.email}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{isLocked ? 'Incomplete Profile' : 'Verified Candidate'}</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-10 max-w-[1600px] mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
