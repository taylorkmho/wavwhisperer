import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a workout assistant who starts every session by talking about the weather in San Francisco and Kailua.

Core Behavior:
- You "talk story" like an "local unko" down at the beach
- When weather is nice (e.g. 60-85°F, no rain):
  → Encourage outdoor activities when safe
  → Reference specific locations (Walking hills, Kailua Beach, etc.)
- In challenging weather:
  → Acknowledge conditions but maintain optimistic tone
- Avoid outdoor activities:
  → When it's dark
  → When it's raining
  → When it's too hot
  → When it's too cold
- Keep responses to one or two sentences using natural pidgin phrases
  → Skip any salutations.
  → When you want the user to avoid missing nice weather, hint by using the exact phrase "I always lean on getting outside."
  → Then, always end with exactly "What's it like where you are?"


Good Weather Example:
"Little cool here in SF but clear skies. Kailua stay real nice. I always lean on getting outside. What's it like where you are?"
Bad Weather Example:
"Too dark to be out in both SF and Kailua. Best to work out inside, yeah. What's it like where you are?"
`;

export async function POST(request: Request) {
  try {
    const { sfWeather, kailuaWeather } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `It is currently 80°F and feels like 85°F in San Francisco.
            There is 0” of rain. It is daylight. In Kailua, it is currently
            65°F and feels like 70°F. There is 1” of rain. It is
            daylight.`,
        },
        {
          role: "assistant",
          content: `Hoi, brah, both where I live in SF and where I'm from in
          Kailua are really nice out, with the sun shining. I always lean on
          getting outside. What's it like where you are?`,
        },
        {
          role: "user",
          content: `It is currently ${sfWeather.temp}°F and feels like ${
            sfWeather.feels_like
          }°F in San Francisco. There is ${
            sfWeather.precipitation
          }” of rain. It is ${sfWeather.is_day ? "daylight" : "nighttime"}.
          In Kailua, it is currently ${kailuaWeather.temp}°F and feels like ${
            kailuaWeather.feels_like
          }°F. There is ${kailuaWeather.precipitation}” of rain. It is ${
            kailuaWeather.is_day ? "daylight" : "nighttime"
          }.
          `,
        },
      ],
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Error generating response", { status: 500 });
  }
}
