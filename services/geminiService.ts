import { GoogleGenAI } from "@google/genai";
import { Question, ChatMessage } from "../types";

/**
 * Initialize the Gemini API using the environment variable.
 * The API key is injected by Netlify during runtime.
 */
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyHelp = async (query: string): Promise<string> => {
  try {
    const ai = getAi();
    // Use gemini-3-flash-preview for fast, standalone academic assistance
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are an intelligent academic assistant for students of Ranchi University. 
        Your goal is to help students understand complex topics, summarize notes, or explain concepts from their syllabus. 
        Be concise, academic, and encouraging. Use formatting like bullet points where helpful.`,
      }
    });

    // property access .text (not a method)
    return response.text || "I couldn't generate a response. Please check your connection.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "The AI service is currently unavailable. Ensure the API_KEY is set in Netlify environment variables.";
  }
};

export const generateAssessmentQuestions = async (subject: string, semester: number, paperName: string): Promise<Question[]> => {
  try {
    const ai = getAi();
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
    const ai = getAi();
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
