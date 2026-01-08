
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, doc, getDoc, setDoc } from "./firebase.ts";

class FirebaseBackend {
  private staticJobs = [
    { id: '1', title: 'Junior Frontend Developer', company: 'Google Cloud', location: 'Bangalore', salary: '₹12–18 LPA', matchScore: 85, link: 'https://google.com/careers', source: 'Google' },
    { id: '2', title: 'SDE Intern', company: 'Microsoft', location: 'Hyderabad', salary: '₹80,000/mo', matchScore: 72, link: 'https://careers.microsoft.com', source: 'Microsoft' },
    { id: '3', title: 'AI Research Assistant', company: 'Meta', location: 'Remote', salary: '₹24 LPA', matchScore: 91, link: 'https://meta.com/careers', source: 'Meta' }
  ];

  private sanitizeJson(text: string | undefined): any {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.error("AI returned empty or non-string response:", text);
      throw new Error("The AI Architect failed to generate content.");
    }

    try {
<<<<<<< HEAD
      // Remove markdown code blocks
      let cleanText = text.replace(/```json|```/g, '').trim();
      
      // Find structural markers for both objects and arrays
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      const firstBracket = cleanText.indexOf('[');
      const lastBracket = cleanText.lastIndexOf(']');

      let start = -1;
      let end = -1;

      // Determine the outermost structure
      const hasBrace = firstBrace !== -1 && lastBrace !== -1;
      const hasBracket = firstBracket !== -1 && lastBracket !== -1;

      if (hasBrace && hasBracket) {
        // Both exist, pick the one that starts first
        start = Math.min(firstBrace, firstBracket);
        end = start === firstBrace ? lastBrace : lastBracket;
      } else if (hasBrace) {
        start = firstBrace;
        end = lastBrace;
      } else if (hasBracket) {
        start = firstBracket;
        end = lastBracket;
      }

      if (start === -1 || end === -1) {
        // If no markers found, try parsing the whole string (it might be a simple value or already clean)
        return JSON.parse(cleanText);
      }

      const jsonString = cleanText.substring(start, end + 1);
=======
      let cleanText = text.replace(/```json|```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      
      if (firstBrace === -1) {
        // If it's an array
        const firstBracket = cleanText.indexOf('[');
        const lastBracket = cleanText.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
          return JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
        }
        throw new Error("No JSON structure found.");
      }

      let jsonString = cleanText.substring(firstBrace, lastBrace + 1);
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
      return JSON.parse(jsonString);
    } catch (e: any) {
      console.error("AI Parsing Error. Raw Content:", text);
      throw new Error("Parsing failed: " + e.message);
    }
  }

  async handleRequest(endpoint: string, method: string, body?: any) {
    const user = auth.currentUser;
    if (!user && endpoint !== '/jobs') throw new Error("Unauthorized");

    try {
      if (method === 'GET') {
        if (endpoint === '/jobs') return this.staticJobs;
        if (user) {
          if (endpoint === '/profile') {
            const snap = await getDoc(doc(db, 'users', user.uid));
            return snap.exists() ? snap.data() : null;
          }
          if (endpoint === '/dashboard-briefing') {
            const snap = await getDoc(doc(db, 'briefings', user.uid));
            return snap.exists() ? snap.data() : null;
          }
        }
      }

      if (method === 'POST' && user) {
<<<<<<< HEAD
        // Get API key from Vite environment variables (defined in vite.config.ts)
        const apiKey = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY is not configured. Please set it in your environment variables.");
        }
        const ai = new GoogleGenAI({ apiKey });
=======
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
        if (endpoint === '/synthesize-profile') return this.handleProfileSynthesis(ai, user.uid, body);
        if (endpoint === '/generate-briefing') return this.handleBriefingGeneration(ai, user.uid, body);
        if (endpoint === '/chat') return this.handleChat(ai, body);
        if (endpoint === '/analyze-resume') return this.handleResumeAnalysis(ai, body);
        if (endpoint === '/generate-resume') return this.handleResumeGeneration(ai, body);
<<<<<<< HEAD
        if (endpoint === '/generate-assessment') return this.handleAssessmentGeneration(ai, body);
=======
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
      }
      throw new Error("Invalid endpoint");
    } catch (error: any) {
      console.error("[BACKEND ERROR]", error);
      throw error;
    }
  }

<<<<<<< HEAD
  private async handleAssessmentGeneration(ai: any, body: any) {
    const { topic, difficulty, count = 30 } = body;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Generate ${count} high-quality professional multiple-choice questions for the topic: "${topic}" at ${difficulty} difficulty level. Each question must have 4 options, a correct index (0-3), and a brief explanation.` }] }],
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: "The question text" },
              a: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options" },
              correct: { type: Type.INTEGER, description: "Correct option index 0-3" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
            },
            required: ["q", "a", "correct", "explanation"]
          }
        }
      }
    });
    return this.sanitizeJson(response.text);
  }

=======
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
  private async handleProfileSynthesis(ai: any, uid: string, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Synthesize a professional tech identity for: ${JSON.stringify(body.userDetails)}` }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preparationStage: { type: Type.STRING },
            suggestedFocusAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    const result = this.sanitizeJson(response.text);
    const data = { ...result, ...body.userDetails, profileCompleted: true, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    return data;
  }

  private async handleBriefingGeneration(ai: any, uid: string, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Generate a career briefing based on this profile: ${JSON.stringify(body.profile)}` }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            welcomeMessage: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            sessionSummary: { type: Type.STRING }
          }
        }
      }
    });
    const briefing = this.sanitizeJson(response.text);
    await setDoc(doc(db, 'briefings', uid), briefing);
    return briefing;
  }

  private async handleChat(ai: any, body: any) {
<<<<<<< HEAD
=======
    // Map history to the required { role, parts: [{ text }] } format
    // Filter out potential invalid messages and ensure it alternates user/model
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
    const contents = body.history
      .filter((m: any) => m.text && m.text.trim())
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

<<<<<<< HEAD
    if (contents.length > 0 && contents[0].role === 'model') {
=======
    // Gemini requires the first message to be from 'user'
    if (contents.length > 0 && contents[0].role === 'model') {
      // If history starts with a model greeting, we prepend a silent user context message
      // or just remove it if it's a generic static greeting.
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
      contents.shift(); 
    }

    contents.push({ role: 'user', parts: [{ text: body.message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: { 
        systemInstruction: "You are a direct, expert career coach. Provide sharp, professional advice for placement prep. Avoid fluff. Do not use emojis.",
        temperature: 0.7 
      }
    });
    return { text: response.text };
  }

  private async handleResumeAnalysis(ai: any, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Analyze the match between this Resume and Job Description.\nResume: ${body.resumeText}\nJob Description: ${body.jobDescription}` }] }],
      config: { 
        temperature: 0, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return this.sanitizeJson(response.text);
  }

  private async handleResumeGeneration(ai: any, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: `Generate a detailed professional resume JSON for: ${JSON.stringify(body.userDetails)}. Template: ${body.templateType}` }] }],
      config: {
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 1024 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                contact: { type: Type.STRING }
              }
            },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            education: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return this.sanitizeJson(response.text);
  }
}

export const server = new FirebaseBackend();
