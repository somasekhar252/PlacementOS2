
import { api } from './api';

/**
 * REFACTORED: The frontend no longer initializes GoogleGenAI.
 * It now makes secure requests to our Node.js backend.
 */

export const chatWithAssistant = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
  try {
    const data = await api.post('/chat', { message, history });
    return data.text;
  } catch (error) {
    console.error("Chat proxy error:", error);
    throw error;
  }
};

export const matchResumeToJob = async (resumeText: string, jobDescription: string) => {
  try {
    return await api.post('/analyze-resume', { resumeText, jobDescription });
  } catch (error) {
    console.error("Analysis proxy error:", error);
    throw error;
  }
};

<<<<<<< HEAD
=======
// This function is now also backend-driven
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
export const generateRecruiterResume = async (userDetails: any, templateType: string) => {
  try {
    return await api.post('/generate-resume', { userDetails, templateType });
  } catch (error) {
    throw error;
  }
};
<<<<<<< HEAD

export const generateAssessment = async (topic: string, difficulty: string, count: number = 30) => {
  try {
    return await api.post('/generate-assessment', { topic, difficulty, count });
  } catch (error) {
    console.error("Assessment generation error:", error);
    throw error;
  }
};
=======
>>>>>>> 619c02e09be8e47f5eb8092a7aefaab1d7fe74fe
