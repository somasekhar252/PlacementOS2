import { api } from './api';

export const chatWithAssistant = async (history: any[], message: string) => {
  const response = await api.post('/chat', { message, history });
  return response.text;
};

export const matchResumeToJob = async (resumeText: string, jobDescription: string) => {
  return await api.post('/analyze-resume', { resumeText, jobDescription });
};

export const generateRecruiterResume = async (userDetails: any, templateType: string) => {
  return await api.post('/generate-resume', { userDetails, templateType });
};

export const generateAssessment = async (topic: string, difficulty: string, count: number = 30) => {
  return await api.post('/generate-assessment', { topic, difficulty, count });
};
