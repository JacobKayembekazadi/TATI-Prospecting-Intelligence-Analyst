import OpenAI from "openai";
import { TATI_SYSTEM_INSTRUCTION } from "../constants";

export const analyzeIntelligence = async (input: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing. Please set OPENAI_API_KEY in environment.");
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: TATI_SYSTEM_INSTRUCTION },
        { role: "user", content: input }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No analysis generated.";
  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
    throw error;
  }
};
