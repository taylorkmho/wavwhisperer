import { generateSurfLimerick } from "@/lib/anthropic/generateSurfLimerick";
import { generateAudio } from "@/lib/elevenlabs/client";
import { fetchNoaaReport } from "@/lib/noaa/client";
import { parseNoaaReport } from "@/lib/noaa/parser";
import * as Sentry from "@sentry/nextjs";

import { SurfReportServerService } from "@/lib/services/surf-report.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Verify cron secret if needed
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("[CRON] Auth failed:", {
        received: authHeader,
        expected: `Bearer ${process.env.CRON_SECRET}`,
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[CRON] Starting cron job execution");

    // Fetch new data
    console.log("[CRON] Step 1: Fetching from NOAA...");
    let xmlText: string;
    let parsedReport: ReturnType<typeof parseNoaaReport>;
    try {
      xmlText = await fetchNoaaReport();
      parsedReport = parseNoaaReport(xmlText);
      console.log(
        `[CRON] Step 1: Success - Fetched report with last_build_date: ${parsedReport.lastBuildDate}`
      );
    } catch (error) {
      console.error("[CRON] Step 1: Failed to fetch/parse NOAA report:", error);
      Sentry.captureException(error, {
        tags: { step: "fetch_noaa_report", cron_job: true },
        extra: { last_build_date: parsedReport?.lastBuildDate },
      });
      throw error;
    }

    // Check if report already exists
    console.log(
      `[CRON] Step 2: Checking for existing report with last_build_date: ${parsedReport.lastBuildDate}`
    );
    const existingReport =
      await SurfReportServerService.findReportByBuildDate(
        parsedReport.lastBuildDate
      );

    if (existingReport) {
      console.log(
        `[CRON] Step 2: Found existing report (ID: ${existingReport.id})`
      );

      // If report exists and has audio, skip the entire process (idempotent)
      if (existingReport.audio_path) {
        console.log(
          `[CRON] Step 2: Existing report already has audio - skipping generation (idempotent)`
        );
        return NextResponse.json({
          success: true,
          report: existingReport,
          audioPath: existingReport.audio_path,
          skipped: true,
          reason: "Report already exists with audio",
        });
      }

      // If report exists but doesn't have audio, we'll update it below
      console.log(
        `[CRON] Step 2: Existing report missing audio - will generate and update`
      );
    } else {
      console.log("[CRON] Step 2: No existing report found - will create new one");
    }

    // Generate limerick
    console.log("[CRON] Step 3: Generating limerick...");
    let poem: string[];
    let model: string;
    try {
      const result = await generateSurfLimerick(parsedReport.discussion);
      poem = result.poem;
      model = result.model;
      console.log(
        `[CRON] Step 3: Success - Generated limerick using model: ${model}`
      );
    } catch (error) {
      console.error("[CRON] Step 3: Failed to generate limerick:", error);
      Sentry.captureException(error, {
        tags: { step: "generate_limerick", cron_job: true },
        extra: {
          last_build_date: parsedReport.lastBuildDate,
          discussion_length: parsedReport.discussion?.length,
        },
      });
      throw error;
    }

    // Save or update report in Supabase
    console.log("[CRON] Step 4: Saving/updating report in Supabase...");
    let savedReport;
    try {
      if (existingReport && !existingReport.audio_path) {
        // Update existing report that doesn't have audio with new poem/model
        savedReport = await SurfReportServerService.updateReport(
          existingReport.id,
          xmlText,
          poem,
          model
        );
        console.log(
          `[CRON] Step 4: Success - Updated existing report (ID: ${savedReport.id})`
        );
      } else {
        // Save new report (or return existing if it already has audio)
        savedReport = await SurfReportServerService.saveReport(
          xmlText,
          poem,
          model
        );
        console.log(
          `[CRON] Step 4: Success - Saved report (ID: ${savedReport.id}, isNew: ${!existingReport})`
        );
      }
    } catch (error) {
      console.error("[CRON] Step 4: Failed to save/update report:", error);
      Sentry.captureException(error, {
        tags: {
          step: "save_update_report",
          cron_job: true,
          is_update: !!existingReport,
        },
        extra: {
          last_build_date: parsedReport.lastBuildDate,
          existing_report_id: existingReport?.id,
          poem_length: poem?.length,
          model,
        },
      });
      throw error;
    }

    // Skip audio generation if report already has audio
    if (savedReport.audio_path) {
      console.log(
        `[CRON] Step 5: Report already has audio - skipping audio generation`
      );
      return NextResponse.json({
        success: true,
        report: savedReport,
        audioPath: savedReport.audio_path,
        skipped: true,
        reason: "Report already has audio",
      });
    }

    // Generate audio and upload to Supabase
    console.log("[CRON] Step 5: Generating and uploading audio...");
    let audioPath: string;
    try {
      audioPath = await generateAudio(poem.join(" "), savedReport.id);
      console.log(`[CRON] Step 5: Success - Generated audio at path: ${audioPath}`);
    } catch (error) {
      console.error("[CRON] Step 5: Failed to generate/upload audio:", error);
      Sentry.captureException(error, {
        tags: { step: "generate_audio", cron_job: true },
        extra: {
          report_id: savedReport.id,
          last_build_date: parsedReport.lastBuildDate,
          poem_length: poem.length,
        },
      });
      throw error;
    }

    // Update the report with the audio path
    console.log("[CRON] Step 6: Updating report with audio path...");
    try {
      await SurfReportServerService.updateAudioPath(savedReport.id, audioPath);
      console.log(`[CRON] Step 6: Success - Updated report with audio path`);
    } catch (error) {
      console.error("[CRON] Step 6: Failed to update audio path:", error);
      Sentry.captureException(error, {
        tags: { step: "update_audio_path", cron_job: true },
        extra: {
          report_id: savedReport.id,
          audio_path: audioPath,
          last_build_date: parsedReport.lastBuildDate,
        },
      });
      throw error;
    }

    console.log("[CRON] Cron job completed successfully");
    return NextResponse.json({
      success: true,
      report: savedReport,
      audioPath,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[CRON] Error in cron job:", {
      message: errorMessage,
      stack: errorStack,
      error,
    });

    // Capture error in Sentry with full context
    Sentry.captureException(error, {
      tags: { cron_job: true, endpoint: "/api/cron" },
      level: "error",
      extra: {
        error_message: errorMessage,
        error_stack: errorStack,
      },
    });

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
