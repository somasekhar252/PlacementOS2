import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, doc, getDoc, setDoc } from "./firebase.ts";

class FirebaseBackend {
  private staticJobs = [
    { id: '1', title: 'Junior Frontend Developer', company: 'Google Cloud', location: 'Bangalore', salary: '₹12–18 LPA', matchScore: 85, link: 'https://google.com/careers', source: 'Google' },
    { id: '2', title: 'SDE Intern', company: 'Microsoft', location: 'Hyderabad', salary: '₹80,000/mo', matchScore: 72, link: 'https://careers.microsoft.com', source: 'Microsoft' },
    { id: '3', title: 'AI Research Assistant', company: 'Meta', location: 'Remote', salary: '₹24 LPA', matchScore: 91, link: 'https://meta.com/careers', source: 'Meta' }
  ];

  private sanitizeJson(text: string | undefined): any {
    if (!text) throw new Error("AI Architect returned empty response.");
    try {
      let cleanText = text.replace(/```json|```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      const firstBracket = cleanText.indexOf('[');
      const lastBracket = cleanText.lastIndexOf(']');

      let start = -1;
      let end = -1;

      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        end = lastBrace;
      } else if (firstBracket !== -1) {
        start = firstBracket;
        end = lastBracket;
      }

      if (start === -1) return JSON.parse(cleanText);
      return JSON.parse(cleanText.substring(start, end + 1));
    } catch (e) {
      console.error("JSON Parse Error:", text);
      throw new Error("Failed to parse AI response.");
    }
  }

  async handleRequest(endpoint: string, method: string, body?: any) {
    const user = auth.currentUser;
    if (!user && endpoint !== '/jobs') throw new Error("Unauthorized");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env.GEMINI_API_KEY as string);
    const ai = new GoogleGenAI(apiKey);

    if (method === 'GET') {
      if (endpoint === '/jobs') return this.staticJobs;
      if (endpoint === '/profile') {
        const snap = await getDoc(doc(db, 'users', user!.uid));
        return snap.exists() ? snap.data() : null;
      }
      if (endpoint === '/dashboard-briefing') {
        const snap = await getDoc(doc(db, 'briefings', user!.uid));
        return snap.exists() ? snap.data() : null;
      }
    }

    if (method === 'POST') {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      if (endpoint === '/synthesize-profile') {
        const prompt = `Synthesize a professional tech identity for: ${JSON.stringify(body.userDetails)}. Return JSON with keys: headline, summary, keySkills, preparationStage, suggestedFocusAreas.`;
        const res = await model.generateContent(prompt);
        const result = this.sanitizeJson(res.response.text());
        await setDoc(doc(db, 'users', user!.uid), { ...result, ...body.userDetails, profileCompleted: true }, { merge: true });
        return result;
      }
      if (endpoint === '/generate-briefing') {
        const prompt = `Generate a career briefing JSON for: ${JSON.stringify(body.profile)}. Include: welcomeMessage, strengths[], focusAreas[], nextSteps[], sessionSummary.`;
        const res = await model.generateContent(prompt);
        const briefing = this.sanitizeJson(res.response.text());
        await setDoc(doc(db, 'briefings', user!.uid), briefing);
        return briefing;
      }
      if (endpoint === '/chat') {
        const chat = model.startChat({ history: body.history.map((m:any) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })) });
        const res = await chat.sendMessage(body.message);
        return { text: res.response.text() };
      }
    }
    throw new Error("Invalid Endpoint");
  }
}

export const server = new FirebaseBackend();
