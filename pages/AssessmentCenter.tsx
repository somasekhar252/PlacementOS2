
import React, { useState, useEffect } from 'react';
import { generateAssessment } from '../services/geminiService';

const AssessmentCenter: React.FC<{ activeAssessment?: any, onBack?: () => void }> = ({ activeAssessment, onBack }) => {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    if (activeAssessment) {
      handleInitialize(activeAssessment);
    }
  }, [activeAssessment]);

  const handleInitialize = async (test: any) => {
    setIsLoading(true);
    setActiveQuiz(test);
    try {
      const data = await generateAssessment(test.title, test.difficulty || 'Medium', 30);
      setQuestions(data);
      setCurrentQuestion(0);
      setScore(0);
      setUserAnswers([]);
      setShowResults(false);
    } catch (err) {
      console.error("Failed to generate quiz", err);
      alert("Neural Synthesis Failed. High traffic detected. Try again.");
      setActiveQuiz(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestion].correct;
    if (isCorrect) setScore(prev => prev + 1);
    
    setUserAnswers([...userAnswers, index]);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const assessments = [
    { 
      id: 'fs-core',
      title: 'Full Stack Engineering', 
      desc: '30 Qs covering React, Node, SQL & Web Architecture.',
      time: '45m', type: 'Technical', difficulty: 'Medium', color: 'blue'
    },
    { 
      id: 'dsa-adv', 
      title: 'Algorithms & Structures', 
      desc: 'Advanced problem solving patterns and complexity analysis.',
      time: '60m', type: 'Coding', difficulty: 'Hard', color: 'emerald' 
    },
    { 
      id: 'apt-master', 
      title: 'Quantitative Logic', 
      desc: 'Data interpretation and logical synthesis for MNC rounds.',
      time: '30m', type: 'Aptitude', difficulty: 'Medium', color: 'amber' 
    },
    { 
      id: 'soft-skills', 
      title: 'Behavioral IQ', 
      desc: 'Communication ethics and team collaboration protocols.',
      time: '20m', type: 'Soft Skills', difficulty: 'Beginner', color: 'indigo' 
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-32 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Synthesizing Core {activeQuiz?.title} Assessment</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Generating 30 Industry-Standard Challenge Blocks...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-10">
          <div className="text-7xl">🏆</div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Assessment Synthesized</h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Verification Complete</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-3xl font-black text-blue-600">{percentage}%</p>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Readiness</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-3xl font-black text-emerald-600">{score}/{questions.length}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Correct Blocks</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-left">
             <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
               "Your performance in the {activeQuiz?.title} module shows high compatibility with Tier-1 Product roles. We recommend focusing on the missing blocks highlighted below."
             </p>
          </div>

          <div className="flex gap-4">
             <button onClick={() => { setShowResults(false); setActiveQuiz(null); setQuestions([]); if (onBack) onBack(); }} className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest active:scale-95 shadow-lg">Back to Hub</button>
             <button onClick={() => handleInitialize(activeQuiz)} className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest active:scale-95 shadow-lg">Retry Assessment</button>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="space-y-6">
           <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest px-4">Detailed Review Matrix</h3>
           {questions.map((q, idx) => (
             <div key={idx} className={`bg-white p-8 rounded-[2rem] border ${userAnswers[idx] === q.correct ? 'border-emerald-100' : 'border-rose-100'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-black text-slate-400 uppercase">Question {idx + 1}</span>
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${userAnswers[idx] === q.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {userAnswers[idx] === q.correct ? 'Passed' : 'Missed'}
                   </span>
                </div>
                <h4 className="font-bold text-slate-800 leading-relaxed">{q.q}</h4>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                   <p className="text-xs font-bold text-slate-900">Explanation:</p>
                   <p className="text-xs text-slate-600 leading-relaxed font-medium">{q.explanation}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (activeQuiz && questions.length > 0) {
    const q = questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-12 animate-in slide-in-from-bottom-6 duration-500">
        <div className="flex justify-between items-center text-slate-400 font-black text-xs uppercase tracking-widest px-4">
          <div className="flex items-center gap-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px]">{activeQuiz.difficulty}</span>
            <span>{activeQuiz.title}</span>
          </div>
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="text-2xl font-black text-slate-900 leading-snug relative z-10">{q.q}</h3>
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {q.a.map((option: string, i: number) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)}
                className="w-full p-6 text-left bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all group flex justify-between items-center active:scale-[0.98]"
              >
                <div className="flex items-center gap-6">
                   <span className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all uppercase">{String.fromCharCode(65 + i)}</span>
                   <span>{option}</span>
                </div>
                <span className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center text-[10px] text-white">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 px-4">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <span>Module Progress</span>
             <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div className="bg-blue-600 h-full transition-all duration-500 shadow-lg" style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
           <button onClick={() => { setActiveQuiz(null); setQuestions([]); }} className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-rose-600 transition-colors">Abort Neural Session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Testing Hub</h1>
          <p className="text-sm text-slate-500 font-medium">Dynamically synthesized challenges for Tier-1 engineering roles.</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-8">
          <div className="text-center border-r border-slate-100 pr-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Percentile</p>
            <p className="text-xl font-black text-emerald-600">Top 4%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Efficiency</p>
            <p className="text-xl font-black text-blue-600">92%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {assessments.map((test, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-2xl transition-all group flex flex-col justify-between relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${test.color}-50 rounded-full blur-2xl -mr-12 -mt-12 opacity-50`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-${test.color}-50 text-${test.color}-600`}>
                  {test.type}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{test.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{test.title}</h3>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-10">{test.desc}</p>
              
              <div className="flex items-center gap-6 text-[11px] text-slate-400 font-black uppercase tracking-tighter mb-10">
                <span className="flex items-center gap-2">⏱️ {test.time}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="flex items-center gap-2">📋 30 Blocks</span>
              </div>
            </div>
            <button 
              onClick={() => handleInitialize(test)}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 relative z-10"
            >
              Initialize Assessment
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#020617] rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_60%)]"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">Elite Credentialing</div>
            <h2 className="text-4xl font-black tracking-tight leading-[1.1]">Placement Eligibility Test (PET 2024)</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">Exceed the 85th percentile across 4 specialized modules to secure the "Industry Certified Agent" badge. Instantly visible to top-tier product recruiters.</p>
          </div>
          <button className="bg-white text-slate-950 px-16 py-6 rounded-full font-black text-xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-blue-600/30 whitespace-nowrap active:scale-95 flex items-center gap-4">
            Register for PET <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCenter;
