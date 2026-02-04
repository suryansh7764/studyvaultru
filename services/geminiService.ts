import { GoogleGenAI } from "@google/genai";
import { Question, ChatMessage } from "../types";

/**
 * AI Initialization following strict guidelines.
 * API_KEY is expected to be provided by the Netlify environment.
 */
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStudyHelp = async (query: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const ai = getAiClient();
    const modelName = 'gemini-3-flash-preview';
    
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are an intelligent academic assistant for students of Ranchi University. 
        Your goal is to help students understand complex topics, summarize notes, or explain concepts from their syllabus. 
        Be concise, academic, and encouraging. Use formatting like bullet points where helpful.
        Maintain context of the previous messages in the chat.`,
      }
    });

    // Accessing text via property, not method call
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "The AI assistant is currently unavailable. Please check the Netlify environment configuration (API_KEY).";
  }
};

export const generateAssessmentQuestions = async (subject: string, semester: number, paperName: string): Promise<Question[]> => {
  try {
    const ai = getAiClient();
    const prompt = `Generate a university-level exam paper for:
    Subject: ${subject}
    Semester: ${semester}
    Paper Topic: ${paperName}

    Create exactly 5 Multiple Choice Questions (MCQ) and 2 Short Subjective Questions.
    
    Return ONLY valid JSON in the following format:
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
    
    return JSON.parse(text) as Question[];
  } catch (e) {
    console.error("Failed to generate questions", e);
    return [];
  }
};

export const evaluateAssessment = async (questions: Question[], answers: Record<number, string>): Promise<{ score: number, total: number, feedback: string }> => {
  try {
    const ai = getAiClient();
    const evaluationPayload = {
      questions: questions,
      studentAnswers: answers
    };

    const prompt = `You are an academic examiner for Ranchi University. Evaluate the following student assessment.
    
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
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

    const result = JSON.parse(text);
    
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