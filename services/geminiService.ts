import { GoogleGenAI, Type } from "@google/genai";
import { HouseRecord } from "../types";

// Helper to chunk the array to avoid token limits if list is huge
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const cleanDataWithGemini = async (records: HouseRecord[]): Promise<HouseRecord[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // We will process the first 40 records as a demo or batch process all if needed.
  // For UI responsiveness and token limits, let's just do a batch.
  // In a real production app, we would process all in parallel chunks.
  
  const BATCH_SIZE = 20; // Process in small batches to ensure JSON stability
  const chunks = chunkArray(records, BATCH_SIZE);
  let cleanedRecords: HouseRecord[] = [];

  for (const chunk of chunks) {
    const prompt = `
      You are a data cleaning assistant. I have a list of house owner details.
      Please standardize the data formatting:
      1. Capitalize Names and Locations properly (Title Case).
      2. Format Phone numbers to be standard (e.g., separate groups with space if needed, remove country code +91 if redundant or keep it consistent).
      3. Fix obvious typos in Area or Pincode.
      4. Ensure empty fields are empty strings.
      
      Return ONLY the cleaned JSON array.
    `;

    try {
        // We use gemini-2.5-flash for speed
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: JSON.stringify(chunk) + "\n\n" + prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            location: { type: Type.STRING },
                            area: { type: Type.STRING },
                            pincode: { type: Type.STRING },
                            mobile: { type: Type.STRING },
                        }
                    }
                }
            }
        });

        if (response.text) {
            const batchResult = JSON.parse(response.text) as HouseRecord[];
            cleanedRecords = [...cleanedRecords, ...batchResult];
        }
    } catch (e) {
        console.error("Batch failed", e);
        // Fallback: keep original for this batch
        cleanedRecords = [...cleanedRecords, ...chunk];
    }
  }

  return cleanedRecords;
};