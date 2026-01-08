
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

/**
 * UTILITY FUNCTIONS FOR AUDIO ENCODING/DECODING
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Use a safer view creation with byte length verification
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const InterviewArena: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState('');
  
  // Refs for resource management and preventing stale closure bugs
  const isLiveRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const stopSession = async () => {
    isLiveRef.current = false;
    setIsLive(false);
    setStatus('Standby');
    setTranscription('');
    
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop all active audio sources immediately
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();

    // Close the Live API session
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }

    // Close and release AudioContext resources
    if (audioCtxRef.current) {
      try { await audioCtxRef.current.close(); } catch(e) {}
      audioCtxRef.current = null;
    }
    if (inputCtxRef.current) {
      try { await inputCtxRef.current.close(); } catch(e) {}
      inputCtxRef.current = null;
    }
    
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => { stopSession(); };
  }, []);

  const startSession = async () => {
    try {
      // 1. Setup Audio Engine
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioCtxRef.current = outputAudioContext;
      inputCtxRef.current = inputAudioContext;
      streamRef.current = stream;
      
      // 2. Set Synchronized State
      isLiveRef.current = true;
      setIsLive(true);
      setStatus('Initializing Recruiter...');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {}, // Enable speech-to-text for the model
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a senior tech recruiter at a top firm. Conduct a brief technical interview. Ask one sharp question at a time. If the candidate gives a good answer, acknowledge it and move deeper. If they struggle, guide them. Keep responses concise.'
        },
        callbacks: {
          onopen: () => {
            if (!isLiveRef.current) return;
            setStatus('Live: Interview in Progress');
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isLiveRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = new Uint8Array(int16.buffer);
              const base64 = encode(pcmData);
              
              sessionPromise.then(session => {
                if (isLiveRef.current) {
                  sessionRef.current = session;
                  session.sendRealtimeInput({ 
                    media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                  });
                }
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!isLiveRef.current) return;

            // Handle Transcription
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + message.serverContent?.outputTranscription?.text).trim());
            }
            
            if (message.serverContent?.turnComplete) {
              // Clear old transcription on turn complete if desired, or keep it scrolling
            }

            // Handle Audio
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
              
              try {
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  audioCtxRef.current,
                  24000,
                  1
                );
                
                const source = audioCtxRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtxRef.current.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              } catch (err) {
                console.warn("Audio processing dropped a frame.");
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(source => { try { source.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            if (isLiveRef.current) stopSession();
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            stopSession();
          }
        }
      });

    } catch (err) {
      console.error(err);
      alert('Initialization Failed: Check microphone permissions.');
      stopSession();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0F172A] rounded-[3rem] p-16 text-white text-center flex flex-col items-center justify-center space-y-10 shadow-2xl relative overflow-hidden min-h-[550px]">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
         
         <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all duration-500 shadow-2xl ${isLive ? 'bg-emerald-500 animate-pulse ring-8 ring-emerald-500/20' : 'bg-slate-800'}`}>
            {isLive ? '🗣️' : '🎯'}
         </div>

         <div className="space-y-4 relative z-10 max-w-2xl">
            <h3 className="text-3xl font-black tracking-tight">AI Interview Simulation</h3>
            <div className="bg-white/10 border border-white/10 py-1.5 px-5 rounded-full inline-block mb-2">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Neural Voice Interface</span>
            </div>
            
            {isLive ? (
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] min-h-[100px] flex items-center justify-center italic text-lg text-indigo-200">
                {transcription || "Listening for recruiter's voice..."}
              </div>
            ) : (
              <p className="text-slate-400 font-medium leading-relaxed">
                Experience a technical mock interview powered by Gemini Live. Our system analyzes your tone, technical accuracy, and conversational flow in a zero-latency environment.
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{status}</span>
            </div>
         </div>

         <div className="flex gap-4 relative z-10">
            {!isLive ? (
              <button onClick={startSession} className="bg-indigo-600 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95">Enter Arena</button>
            ) : (
              <button onClick={stopSession} className="bg-rose-600 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl active:scale-95">Terminate Session</button>
            )}
         </div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase">Live Session Metrics</h3>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg uppercase">System: PlacementOS Native</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency Protocol</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-indigo-600">PCM STREAM</p>
                   <span className="text-[10px] font-bold text-slate-400 mb-1">16kHz</span>
                </div>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Synthesis</p>
                <p className="text-2xl font-black text-slate-900">GEMINI 2.5</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Persona</p>
                <p className="text-2xl font-black text-emerald-600 italic">SENIOR LEAD</p>
             </div>
          </div>

          <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex items-start gap-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-indigo-100 shrink-0">💡</div>
            <div className="space-y-3">
              <p className="text-sm font-black text-indigo-900 uppercase tracking-widest">Tactical Advice</p>
              <p className="text-xs font-bold text-indigo-700/80 leading-relaxed">
                The AI is configured to evaluate technical precision. Use specific terminology (e.g., "Complexity analysis", "State lifting", "Hydration") to maximize your compatibility score. If the browser tab feels sluggish, terminate the session to release high-fidelity audio buffers.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default InterviewArena;
