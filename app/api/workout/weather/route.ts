import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchWeather } from "@/lib/weather/client";

const querySchema = z.object({
  lat: z.string().transform(Number),
  lon: z.string().transform(Number),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { lat, lon } = querySchema.parse({
      lat: searchParams.get("lat"),
      lon: searchParams.get("lon"),
    });

    const weather = await fetchWeather(lat, lon);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("Error fetching weather:", error);
    return new NextResponse("Error fetching weather", { status: 500 });
  }
}
