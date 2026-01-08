import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { auth } from '../firebase.ts';

interface ProfileViewProps {
  onComplete?: (data: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: '',
    branch: '',
    college: '',
    graduationYear: '',
    skills: '',
    projects: '',
    careerGoal: '',
    prepLevel: 'beginner'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/profile');
        if (data && data.profileCompleted) {
          setProfile(data);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSynthesize = async () => {
    if (!form.name || !form.skills) return;
    setLoading(true);
    try {
      const result = await api.post('/synthesize-profile', { userDetails: form });
      const finalizedData = { ...result, ...form, profileCompleted: true };
      setProfile(finalizedData);
      if (onComplete) onComplete(finalizedData);
    } catch (err) {
      alert("Synthesis failed. Check connectivity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Syncing Identity Matrix...</div>;

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl space-y-6">
        <h2 className="text-2xl font-black">Identity Synthesis</h2>
        <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="Skills (comma separated)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
        <textarea className="w-full p-4 bg-slate-50 rounded-xl border h-32" placeholder="Key Projects" value={form.projects} onChange={e => setForm({...form, projects: e.target.value})} />
        <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="Career Goal" value={form.careerGoal} onChange={e => setForm({...form, careerGoal: e.target.value})} />
        <button onClick={handleSynthesize} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest">Synthesize Career OS</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-8">
      <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white">
        {profile?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-black">{profile?.name}</h2>
        <p className="text-blue-600 font-bold">{profile?.headline}</p>
        <p className="text-slate-500 text-sm mt-2">{profile?.summary}</p>
      </div>
      <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase">Edit Profile</button>
    </div>
  );
};

export default ProfileView;
