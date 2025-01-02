import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { routineSchema, workoutFormSchema } from "@/lib/schemas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = workoutFormSchema.parse(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional fitness trainer specializing in creating personalized workouts.
          Create a workout routine that matches these parameters:
          - Equipment: ${data.equipment}
          - Focus Area: ${data.focusArea}
          - Intensity: ${data.intensity}
          - Duration: ${data.duration} minutes`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const workoutData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Validate the response matches our schema
    const validatedWorkout = routineSchema.parse(workoutData);

    return NextResponse.json(validatedWorkout);
  } catch (error) {
    console.error("Error generating workout:", error);
    return new NextResponse("Error generating workout", { status: 500 });
  }
}
