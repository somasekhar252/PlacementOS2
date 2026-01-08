import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const InterviewArena: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const stopSession = () => {
    setIsLive(false);
    setStatus('Standby');
    if (processorRef.current) processorRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
  };

  const startSession = async () => {
    try {
      setStatus('Initializing Audio...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      streamRef.current = stream;
      audioCtxRef.current = audioContext;
      processorRef.current = processor;

      processor.onaudioprocess = async (e) => {
        if (!isLive) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 for Gemini PCM format
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        // Proxy audio data to backend (Simplified for prototype logic)
        // In a full production app, this would use a WebSocket
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      
      setIsLive(true);
      setStatus('Live: Interview in Progress');
      setTranscription("Recruiter: 'Welcome. Tell me about your experience with Scalable Systems.'");
      
    } catch (err) {
      console.error(err);
      alert('Mic access denied or hardware error.');
      stopSession();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0F172A] rounded-[3rem] p-16 text-white text-center flex flex-col items-center justify-center space-y-10 shadow-2xl relative overflow-hidden min-h-[550px]">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all duration-500 shadow-2xl ${isLive ? 'bg-emerald-500 animate-pulse ring-8 ring-emerald-500/20' : 'bg-slate-800'}`}>
          {isLive ? '🗣️' : '🎯'}
        </div>

        <div className="space-y-4 relative z-10 max-w-2xl">
          <h3 className="text
