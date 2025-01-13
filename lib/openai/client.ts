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

export async function generateSurfLimerick(
  discussion: string[]
): Promise<{ poem: string[]; model: string }> {
  return withOpenAIErrorHandler(async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Create a Surf Forecast Limerick with exactly 5 lines. Think about it.

GUIDELINES
- This report is for Hawaii.
- Someone should be able to read it and decide where and when to surf.

LIMERICK STRUCTURE
1. Opening (Lines 1-2):
  - Establish dominant swell(s) direction (e.g. north, west)
  - Both lines rhyme (sound A)
  - The rhythm pattern is anapestic, which means the emphasis goes "da da DUM, da da DUM" (weak weak STRONG). In written form, it looks like this:
    - da da DUM da da DUM da da DUM

2. Middle (Line 3-4):
  - Contrast with remaining, non-dominant swells/shores
  - Shorter lines
  - Both lines rhyme (sound B)
  - da da DUM da da

3. Conclusion (Line 5):
  - Return to Line 1-2's rhyme (A)
  - Return to longer meter
  - da da DUM da da DUM da da DUM

STRICT REQUIREMENTS
- Exactly 5 lines, with each on a new line
- Rhyme scheme: AABBA
- Every line must contain forecast information (e.g. direction, size, time, shore)
- Every swell direction (e.g. north, south, east, west) should be mentioned if it is forecasted
- Always abbreviate swell directions (e.g. N, S, E, W, NW, SW, etc.)
- Include day when available (e.g. "Saturday")

The final limerick should convey key forecast information within this strict format.`,
        },
        {
          role: "user",
          content: `The first of a series of large to extra large northwest swells is due this weekend. Long period forerunners are expected Saturday morning&#44; will build quickly down the island chain Saturday afternoon and peak Saturday night and early Sunday. Another round of large to extra large northwest swell is expected Monday through Thursday next week. Surf along east and south facing shores will remain small through the forecast period.`,
        },
        {
          role: "assistant",
          content: `
The long-period swells creep their way
Through Saturday's dawn, they won't stay
While east shores lie flat
Next week brings more that
A four-day XL wave buffet!`,
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
