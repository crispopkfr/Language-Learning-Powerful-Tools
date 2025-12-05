


import { GoogleGenAI, Type } from "@google/genai";
import { GrammarAnalysis, RewriteAnalysis, RewriteStyle } from "../types";
import { getStoredApiKey } from "./storageService";

declare const process: {
  env: {
    API_KEY: string | undefined;
  }
};

const modelId = "gemini-2.5-flash";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dynamic client initialization
const getGenAIClient = () => {
  // Prioritize the user-provided API key from local storage, fallback to env variable.
  const apiKey = getStoredApiKey() || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  
  return new GoogleGenAI({ apiKey });
};

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      // Robust error message extraction to handle various error shapes
      let msg = error?.message || '';
      
      // Handle the specific JSON error structure: {"error": {"code": 429, ...}}
      if (error?.error) {
          msg += JSON.stringify(error.error);
      }
      
      // Fallback for other object types
      if (typeof error === 'object') {
          try {
             msg += JSON.stringify(error);
          } catch(e) {}
      }
      
      msg += error?.toString() || '';

      // Check for specific error types
      if (msg.includes('MISSING_API_KEY')) {
        throw error; // Do not retry missing key
      }

      // Check for Permission Denied (403)
      if (msg.includes('PERMISSION_DENIED') || msg.includes('403') || msg.includes('Permission denied')) {
        throw new Error("PERMISSION_DENIED");
      }

      // Check for 429 (Too Many Requests/Quota) or 503 (Service Unavailable)
      const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota');
      const isServerOverload = msg.includes('503') || msg.includes('Overloaded');

      if (!isRateLimit && !isServerOverload) {
        throw error;
      }

      attempt++;
      if (attempt >= retries) throw error;

      const waitTime = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`API Request failed (Attempt ${attempt}/${retries}). Retrying in ${waitTime}ms...`, error);
      await delay(waitTime);
    }
  }
  throw new Error("Max retries exceeded");
}

export const checkGrammar = async (text: string): Promise<GrammarAnalysis> => {
  return retryWithBackoff(async () => {
    try {
      const genAI = getGenAIClient();
      
      const response = await genAI.models.generateContent({
        model: modelId,
        contents: `Analyze the following text for grammar, spelling, punctuation, and style improvements. 
        
        Input Text: "${text}"
        
        Important: Provide the 'explanation' (overview and improvements) in English.
        
        Return a JSON object with:
        1. 'segments': An array representing the ORIGINAL text reconstructed exactly, but split into parts. 
           - Mark parts with strict grammar/spelling errors as 'isError': true and 'severity': 'critical'.
           - Mark parts that are grammatically correct but have stylistic suggestions/improvements as 'isError': true and 'severity': 'suggestion'.
        2. 'correctedSentence': The fully corrected version of the text.
        3. 'correctedWords': An array of objects {text, ipa} representing the corrected sentence broken down into tokens (words, spaces, punctuation). For actual words, provide the IPA pronunciation in 'ipa' (Do NOT include slashes /.../ around the pronunciation). For spaces/punctuation, 'ipa' should be empty.
        4. 'explanation': A structured object containing a professional overview and a list of specific improvements (IN English).
        
        Important: When reassembling the 'segments' text properties, it MUST equal the exact original input text (including whitespaces).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              segments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "A portion of the original text. Include spaces/punctuation if they belong here." },
                    isError: { type: Type.BOOLEAN, description: "True if this segment contains an error or suggestion." },
                    severity: { type: Type.STRING, enum: ["critical", "suggestion"], description: "critical: strict grammar/spelling error. suggestion: stylistic improvement but grammatically valid." },
                    correction: { type: Type.STRING, description: "The corrected version of this specific segment (if error)." },
                    reason: { type: Type.STRING, description: "Short reason for the error (if error)." }
                  },
                  required: ["text", "isError"]
                }
              },
              correctedSentence: { type: Type.STRING },
              correctedWords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "The word, space, or punctuation mark." },
                    ipa: { type: Type.STRING, description: "IPA pronunciation for words (RAW string without slashes), empty string for non-words." }
                  },
                  required: ["text", "ipa"]
                }
              },
              explanation: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING, description: `A professional, concise summary of the text's quality (1-2 sentences) in English.` },
                  improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: `A list of specific grammar rules applied or corrections made in English.` }
                },
                required: ["overview", "improvements"]
              }
            },
            required: ["segments", "correctedSentence", "correctedWords", "explanation"]
          }
        }
      });

      if (!response.text) {
          throw new Error("No response text from Gemini");
      }

      const data = JSON.parse(response.text) as GrammarAnalysis;
      return data;

    } catch (error) {
      console.error("Error checking grammar:", error);
      throw error;
    }
  });
};

export const rewriteText = async (text: string, style: RewriteStyle): Promise<RewriteAnalysis> => {
  return retryWithBackoff(async () => {
    try {
      const genAI = getGenAIClient();

      const response = await genAI.models.generateContent({
        model: modelId,
        contents: `Rewrite the following text in a "${style}" style.
        
        Input Text: "${text}"
        
        Important: Provide the 'explanation' in English.
        
        Return a JSON object with:
        1. 'rewrittenText': The text rewritten in the requested style.
        2. 'rewrittenWords': An array of objects {text, ipa} representing the rewritten text broken down into tokens (words, spaces, punctuation). For actual words, provide the IPA pronunciation in 'ipa' (Do NOT include slashes /.../ around the pronunciation). For spaces/punctuation, 'ipa' should be empty.
        3. 'explanation': A structured object containing an overview of the style changes and specific techniques used to match the '${style}' tone (IN English).
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rewrittenText: { type: Type.STRING, description: "The rewritten text." },
              rewrittenWords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "The word, space, or punctuation mark." },
                    ipa: { type: Type.STRING, description: "IPA pronunciation for words (RAW string without slashes), empty string for non-words." }
                  },
                  required: ["text", "ipa"]
                }
              },
              explanation: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING, description: `A concise summary of how the style was applied in English.` },
                  improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: `List of specific stylistic changes or techniques in English.` }
                },
                required: ["overview", "improvements"]
              }
            },
            required: ["rewrittenText", "rewrittenWords", "explanation"]
          }
        }
      });

      if (!response.text) {
        throw new Error("No response text from Gemini");
      }

      const data = JSON.parse(response.text);
      return {
        originalText: text,
        rewrittenText: data.rewrittenText,
        rewrittenWords: data.rewrittenWords,
        style: style,
        explanation: data.explanation
      };

    } catch (error) {
      console.error("Error rewriting text:", error);
      throw error;
    }
  });
};

export const generateExampleSentence = async (word: string, definition: string): Promise<string> => {
  return retryWithBackoff(async () => {
    try {
      const genAI = getGenAIClient();
      const response = await genAI.models.generateContent({
        model: modelId,
        contents: `Write a single, short, natural English example sentence using the word "${word}" that demonstrates the following definition: "${definition}". Return ONLY the sentence.`,
      });
      
      const text = response.text?.trim();
      if (!text) throw new Error("No text generated");
      
      // Clean up quotes if the model adds them
      return text.replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error("Error generating example:", error);
      throw error;
    }
  });
};