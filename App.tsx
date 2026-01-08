import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import JobBoard from './components/JobBoard';
import Assistant from './components/Assistant';
import ResumeStudio from './components/ResumeStudio';
import AssessmentCenter from './pages/AssessmentCenter';
import InterviewArena from './pages/InterviewArena';
import PlacementEngine from './pages/PlacementEngine';
import ProfileView from './components/ProfileView';
import { auth, onAuthStateChanged } from './firebase.ts';
import { api } from './services/api';

/**
 * Main Application Component
 * Handles global state for authentication, profile completion, and navigation.
 */
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Listen for Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore once authenticated
  useEffect(() => {
    const checkState = async () => {
      if (user) {
        setProfileLoading(true);
        try {
          const data = await api.get('/profile');
          setProfileData(data);
          
          // Force user to profile tab if identity synthesis is not complete
          if (!data || data.profileCompleted === false) {
            setActiveTab('profile');
          }
        } catch (e) {
          console.error("Critical Profile Fetch Error:", e);
          // Fallback to profile tab on error to ensure user can initialize OS
          setActiveTab('profile');
        } finally {
          setProfileLoading(false);
        }
      }
    };
    checkState();
  }, [user]);

  // Loading Screen: Displayed during Identity Syncing
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Syncing OS Identity...
        </p>
      </div>
    );
  }

  // Check if the user is locked to the profile synthesis stage
  const isProfileIncomplete = !profileData || profileData.profileCompleted === false;
  
  // Override visual tab if the profile is incomplete
  const effectiveTab = isProfileIncomplete ? 'profile' : activeTab;

  /**
   * Component Router
   * Renders the view based on the active navigation state
   */
  const renderContent = () => {
    switch (effectiveTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'jobs':
        return <JobBoard />;
      case 'assistant':
        return <Assistant />;
      case 'resume':
        return <ResumeStudio />;
      case 'assessments':
        return <AssessmentCenter />;
      case 'interviews':
        return <InterviewArena />;
      case 'placement':
        return <PlacementEngine />;
      case 'profile':
        return (
          <ProfileView 
            onComplete={(data) => {
              setProfileData(data);
              // Successful synthesis transition animation delay
              setTimeout(() => setActiveTab('dashboard'), 1500);
            }} 
          />
        );
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout 
      activeTab={effectiveTab} 
      setActiveTab={setActiveTab}
      isLocked={isProfileIncomplete}
    >
      <div className="max-w-7xl mx-auto pb-12">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
