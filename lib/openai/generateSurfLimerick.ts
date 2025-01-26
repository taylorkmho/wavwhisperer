import { openai } from "./client";

import { withOpenAIErrorHandler } from "./client";

export async function generateSurfLimerick(
  discussion: string[]
): Promise<{ poem: string[]; model: string }> {
  const joinedDiscussion = discussion.join("\n");
  const persona =
    "You are a surf-forecasting clairvoyant peeking into a crystal ball.";
  const instruction = "Generate a surf-forecast 5-line limerick.";
  const context = `
This report is for Hawaii's coastlines.
Your limerick should establish dominant swell(s) direction (e.g. N, W, SW, etc.)
It should also contrast with remaining, non-dominant swells/shores.
  `;
  const format = `
The limerick should be exactly 5 lines long.
The rhyme scheme is AABBA.
Use metaphors and puns related to Hawaii's unique culture to make the limerick more engaging.
Include day when available (e.g. "Saturday")
Lines 1, 2, and 5 must rhyme and have 8-9 syllables (sound A)
- The rhythm pattern is anapestic, which means the emphasis goes "da da DUM, da da DUM" (weak weak STRONG).
- These lines should be longer (da da DUM da da DUM da da DUM)
Lines 3 and 4 must rhyme and have 4-5 syllables (sound B)
Every line must contain forecast information (e.g. direction, size, time, shore).
Every swell or wave direction should be mentioned if it is forecasted
  `;
  const audience = `
The audience is surfers.
Someone should be able to read it and decide where and when to surf.`;
  const tone = "The tone should be funny and engaging.";
  const data = joinedDiscussion;

  return withOpenAIErrorHandler(async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `${persona}
${instruction}
${context}
${format}
${audience}
${tone}
${data}
`,
        },
        {
          role: "user",
          content: `The current long period northwest swell will slowly decline today. Surf heights along north and west facing shores will steadily decrease in line with this decreasing swell energy. The next northwest swell may produce advisory level surf along exposed north and west facing shores from Tuesday into Wednesday&#44; then slowly fade through the end of the week.",
East facing shore surf will remain choppy the next few days as the trades build&#44; and background south swell will keep surf small on south facing shores through the coming week.`,
        },
        {
          role: "assistant",
          content: `The northwest swell’s fade starts today,
As north and west walls slip away.
With Tuesday’s next rise,
Advisory size,
Then small on the south, come what may!`,
        },
        {
          role: "user",
          content: joinedDiscussion,
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
