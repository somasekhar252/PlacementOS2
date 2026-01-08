import React, { useState, useEffect } from 'react';
import { generateAssessment } from '../services/geminiService';

const AssessmentCenter: React.FC<{ activeAssessment?: any, onBack?: () => void }> = ({ activeAssessment, onBack }) => {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeAssessment) {
      handleInitialize(activeAssessment);
    }
  }, [activeAssessment]);

  const handleInitialize = async (test: any) => {
    setIsLoading(true);
    setActiveQuiz(test);
    try {
      const data = await generateAssessment(test.title, test.difficulty || 'Medium', 10);
      setQuestions(data);
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
    } catch (err) {
      alert("Failed to synthesize assessment. Neural link unstable.");
      if (onBack) onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) setScore(prev => prev + 1);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-400">SYNTHESIZING NEURAL CHALLENGES...</div>;

  if (showResults) return (
    <div className="max-w-xl mx-auto py-20 bg-white rounded-[3rem] shadow-2xl text-center p-12">
      <div className="text-6xl mb-6">🏆</div>
      <h2 className="text-3xl font-black mb-2">Evaluation Complete</h2>
      <p className="text-7xl font-black text-blue-600 mb-8">{Math.round((score/questions.length)*100)}%</p>
      <button onClick={() => onBack?.()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase">Return to Hub</button>
    </div>
  );

  if (activeQuiz && questions.length > 0) {
    const q = questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border space-y-10">
          <h3 className="text-2xl font-black text-slate-900">{q.q}</h3>
          <div className="grid grid-cols-1 gap-4">
            {q.a.map((option: string, i: number) => (
              <button key={i} onClick={() => handleAnswer(i)} className="w-full p-6 text-left bg-slate-50 border rounded-2xl font-bold hover:border-blue-500 transition-all flex justify-between">
                <span>{option}</span>
                <span className="text-slate-300">→</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div>
        </div>
      </div>
    );
  }

  return <div className="p-20 text-center text-slate-400">Select an assessment from Opportunity Hub.</div>;
};

export default AssessmentCenter;
