import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

// Reusable error wrapper for OpenAI calls
export const withOpenAIErrorHandler = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (error.status === 400) {
        throw new Error(`Invalid request: ${error.message}`);
      }
      if (error.status === 401) {
        throw new Error("Invalid API key or unauthorized access.");
      }
    }
    throw error;
  }
};
