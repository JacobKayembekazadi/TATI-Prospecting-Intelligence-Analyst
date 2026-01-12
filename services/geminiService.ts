
import { GoogleGenAI } from "@google/genai";
import { TATI_SYSTEM_INSTRUCTION } from "../constants";

export const analyzeIntelligence = async (input: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is provided in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: input,
      config: {
        systemInstruction: TATI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
