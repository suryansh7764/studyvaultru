
import { GoogleGenAI } from "@google/genai";
import { Question, ChatMessage } from "../types";

// Helper to retrieve API Key from storage or environment
const getApiKey = (): string => {
  // Check localStorage first (user-provided key overrides env)
  const storedKey = localStorage.getItem('ru_api_key');
  if (storedKey) return storedKey;
  
  // Fallback to process.env (safe access via window shim in index.html)
  // @ts-ignore
  return (window.process?.env?.API_KEY) || '';
};

// Helper to initialize the AI client
const getClient = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateStudyHelp = async (query: string, history: ChatMessage[] = []): Promise<string> => {
  const ai = getClient();
  
  if (!ai) {
    return "API Key is missing. Please click the Settings (Gear) icon in the header to configure your Google Gemini API Key.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Map existing history to Gemini parts format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are an intelligent academic assistant for students of Ranchi University. 
        Your goal is to help students understand complex topics, summarize notes, or explain concepts from their syllabus (Physics, Math, History, etc.). 
        Be concise, academic, and encouraging. If asked about specific previous year questions, give general guidance on how to solve similar problems.
        Maintain context of the previous messages in the chat.`,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes('API key')) {
        return "Invalid API Key. Please update it in Settings.";
    }
    return "Sorry, I encountered an error while processing your request. Please check your network or API quota.";
  }
};

export const generateAssessmentQuestions = async (subject: string, semester: number, paperName: string): Promise<Question[]> => {
  const ai = getClient();
  if (!ai) {
      alert("API Key is missing. Please configure it in Settings.");
      return [];
  }

  try {
    const prompt = `Generate a university-level exam paper for:
    Subject: ${subject}
    Semester: ${semester}
    Paper Topic: ${paperName}

    Create exactly 5 Multiple Choice Questions (MCQ) and 2 Short Subjective Questions.
    
    Return ONLY valid JSON in the following format (no markdown, no backticks):
    [
      { "id": 1, "type": "MCQ", "text": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "Option text", "maxMarks": 2 },
      ...
      { "id": 6, "type": "SUBJECTIVE", "text": "Question text", "maxMarks": 5 }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as Question[];
  } catch (e) {
    console.error("Failed to generate questions", e);
    return [];
  }
};

export const evaluateAssessment = async (questions: Question[], answers: Record<number, string>): Promise<{ score: number, total: number, feedback: string }> => {
  const ai = getClient();
  if (!ai) return { score: 0, total: 0, feedback: "API Key Config Error" };

  try {
    const evaluationPayload = {
      questions: questions,
      studentAnswers: answers
    };

    const prompt = `You are an academic examiner. Evaluate the following student assessment.
    
    Data: ${JSON.stringify(evaluationPayload)}

    For MCQs: Check strict correctness.
    For Subjective: Grade based on relevance, keywords, and clarity (out of maxMarks).
    
    Return ONLY valid JSON:
    {
      "totalScoreObtained": number,
      "totalMaxMarks": number,
      "feedback": "A short summary (max 30 words) of performance."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonStr);
    
    return {
      score: result.totalScoreObtained,
      total: result.totalMaxMarks,
      feedback: result.feedback
    };

  } catch (e) {
    console.error("Evaluation failed", e);
    return { score: 0, total: 0, feedback: "Evaluation Error" };
  }
};
