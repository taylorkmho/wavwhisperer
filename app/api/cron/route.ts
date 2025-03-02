import { generateSurfLimerick } from "@/lib/anthropic/generateSurfLimerick";
import { generateAudio } from "@/lib/elevenlabs/client";
import { fetchNoaaReport } from "@/lib/noaa/client";
import { parseNoaaReport } from "@/lib/noaa/parser";

import { SurfReportServerService } from "@/lib/services/surf-report.server";
import { NextResponse } from "next/server";

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
    const xmlText = await fetchNoaaReport();
    const parsedReport = parseNoaaReport(xmlText);

    // Generate limerick
    console.log("Generating limerick...");
    const { poem, model } = await generateSurfLimerick(parsedReport.discussion);

    // Save to Supabase using server service
    console.log("Saving to Supabase...");
    const savedReport = await SurfReportServerService.saveReport(
      xmlText,
      poem,
      model
    );

    // Generate audio and upload to Supabase
    console.log("Generating and uploading audio...");
    const audioPath = await generateAudio(poem.join(" "), savedReport.id);

    // Update the report with the audio path
    await SurfReportServerService.updateAudioPath(savedReport.id, audioPath);

    return NextResponse.json({ success: true, report: savedReport, audioPath });
  } catch (error) {
    console.error("Error in cron job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
