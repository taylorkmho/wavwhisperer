import { NextResponse } from "next/server";
import { parseNoaaReport } from "@/lib/noaa/parser";

const NOAA_URL = "https://www.weather.gov/source/hfo/xml/SurfState.xml";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  try {
    const response = await fetch(NOAA_URL);
    const xmlText = await response.text();

    // Return raw XML if requested
    if (format === "raw") {
      return NextResponse.json(xmlText);
    }

    // Otherwise return parsed data
    const report = parseNoaaReport(xmlText);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Failed to fetch NOAA data:", error);
    return NextResponse.json(
      { error: "Failed to fetch surf report" },
      { status: 500 }
    );
  }
}
