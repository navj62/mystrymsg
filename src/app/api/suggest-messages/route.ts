import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_QUESTIONS, parseSuggestions } from "@/lib/suggestions";

export const runtime = "nodejs";

const PROMPT =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return Response.json(
      { success: true, questions: FALLBACK_QUESTIONS, fallback: true },
      { status: 200 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionsString: {
              type: Type.STRING,
              description: "Three questions separated by ||",
            },
          },
          required: ["questionsString"],
        },
      },
    });

    const result = response.text;
    if (!result) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = JSON.parse(result) as { questionsString: string };
    const questions = parseSuggestions(parsed.questionsString);

    return Response.json({ success: true, questions }, { status: 200 });
  } catch (error) {
    console.error("suggest-messages: Gemini call failed:", error);
    // Graceful degradation: return defaults instead of breaking the page.
    return Response.json(
      { success: true, questions: FALLBACK_QUESTIONS, fallback: true },
      { status: 200 }
    );
  }
}
