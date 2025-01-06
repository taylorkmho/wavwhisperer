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
      // Handle rate limits
      if (error.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      // Handle invalid requests
      if (error.status === 400) {
        throw new Error(
          `Invalid request. Please check your inputs. ${error.message}`
        );
      }
    }
    throw error;
  }
};

export async function generateSurfLimerick(
  discussion: string[]
): Promise<{ poem: string[]; model: string }> {
  return withOpenAIErrorHandler(async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
Create a Surf Forecast Limerick with exactly 5 lines

LIMERICK STRUCTURE
1. Opening (Lines 1-2):
  - Establish dominant swell(s) direction (e.g. north, west)
  - Creative use of pidgin language for size/intensity
  - Both lines rhyme (sound A)

2. Middle (Line 3-4):
  - Contrast with remaining, non-dominant swells/shores
  - Shorter line with anapestic meter
  - Both lines rhyme (sound B)

3. Conclusion (Line 5):
  - Return to Line 1-2's rhyme (A)
  - Return to longer meter

STRICT REQUIREMENTS
- Exactly 5 lines
- No extra spaces before or after lines
- Rhyme scheme: AABBA
- Every line must contain forecast information (e.g. direction, size, time, shore)
- Cover all aspects of the forecast
 * If there is any mention for a specific direction, include it
 * If there is any mention for a specific day or time, include it
 * If there is any mention for a specific swell size, include it
- Every swell direction (e.g. north, south, east, west) should be mentioned if it is forecasted

The final limerick should convey key forecast information within this strict format.`,
        },
        {
          role: "user",
          content: discussion.join("\n"),
        },
      ],
    });

    const lines =
      completion.choices[0].message.content
        ?.trim()
        .split("\n")
        .filter((line) => line.trim().length > 0) || [];
    return { poem: lines, model: completion.model };
  });
}
