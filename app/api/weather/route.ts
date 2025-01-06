import { NextResponse } from "next/server";
import { weatherSchema } from "@/types/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return new NextResponse("Missing coordinates", { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,is_day&timezone=auto&temperature_unit=fahrenheit&precipitation_unit=inch&daily=sunrise,sunset`;

  const response = await fetch(url);
  const data = await response.json();

  const weather = {
    temp: Math.round(data.current.temperature_2m),
    feels_like: Math.round(data.current.apparent_temperature),
    precipitation: data.current.precipitation,
    is_day: data.current.is_day === 1,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };

  const validated = weatherSchema.parse(weather);
  return NextResponse.json(validated);
}
