import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Reusable error wrapper for Anthropic calls
export const withAnthropicErrorHandler = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
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
