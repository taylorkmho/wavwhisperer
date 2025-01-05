import { SurfReportService } from "@/lib/services/surf-report";
import { NextResponse } from "next/server";

const NOAA_URL = "https://www.weather.gov/source/hfo/xml/SurfState.xml";

export async function GET(request: Request) {
  try {
    // Verify cron secret if needed
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Auth failed:", {
        received: authHeader,
        expected: `Bearer ${process.env.CRON_SECRET}`,
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch new data
    console.log("Fetching from NOAA...");
    const response = await fetch(NOAA_URL);
    if (!response.ok) {
      throw new Error(
        `NOAA fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();
    console.log("Received XML length:", xmlText.length);

    // Save to Supabase
    console.log("Saving to Supabase...");
    const savedReport = await SurfReportService.saveReport(xmlText);

    return NextResponse.json({ success: true, report: savedReport });
  } catch (error) {
    // Log the full error details
    console.error("Failed to process surf report:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to process surf report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
