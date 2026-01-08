import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profile = await api.get('/profile');
        if (profile && profile.profileCompleted) {
          let data = await api.get('/dashboard-briefing');
          if (!data) {
            data = await api.post('/generate-briefing', { profile });
          }
          setBriefing(data);
        }
      } catch (err) {
        console.error("Dashboard Load Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Synthesizing Briefing...</div>;

  if (!briefing) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <h3 className="text-xl font-black mb-4">OS Standby</h3>
        <p className="text-slate-500 mb-6">Finalize your profile to activate the AI Briefing engine.</p>
        <button onClick={() => setActiveTab('profile')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold uppercase">Complete Profile</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-[#0F172A] p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <h2 className="text-4xl font-black leading-tight max-w-3xl">{briefing.welcomeMessage}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6">Confirmed Strengths</h3>
          <div className="space-y-3">
            {briefing.strengths?.map((s: string, i: number) => (
              <div key={i} className="flex gap-3 text-sm font-bold text-slate-700">✦ {s}</div>
            ))}
          </div>
        </div>
        <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
          <h3 className="text-xs font-black uppercase mb-6">Immediate Next Steps</h3>
          <div className="space-y-4">
            {briefing.nextSteps?.map((step: string, i: number) => (
              <div key={i} className="bg-white/10 p-4 rounded-2xl text-xs font-bold">{step}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
