import { parseNoaaReport } from "@/lib/noaa/parser";
import {
  surfReportRecordSchema,
  type SurfReportRecord,
} from "@/types/database";
import * as Sentry from "@sentry/nextjs";
import { supabaseAdmin } from "../supabase/admin-client";

export class SurfReportServerService {
  /**
   * Check if a report with the given last_build_date already exists
   */
  static async findReportByBuildDate(
    lastBuildDate: string
  ): Promise<SurfReportRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("surf_reports")
      .select("*")
      .eq("last_build_date", lastBuildDate)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      const err = new Error(
        `Failed to check for existing report: ${error.message}`
      );
      Sentry.captureException(err, {
        tags: { service: "SurfReportServerService", method: "findReportByBuildDate" },
        extra: { last_build_date: lastBuildDate, supabase_error: error },
      });
      throw err;
    }

    return data ? surfReportRecordSchema.parse(data) : null;
  }

  /**
   * Save or update a surf report. Returns existing report if found, otherwise inserts new one.
   * This makes the operation idempotent - running it multiple times with the same data won't create duplicates.
   */
  static async saveReport(
    xmlData: string,
    poem: string[],
    model: string
  ): Promise<SurfReportRecord> {
    const parsedReport = parseNoaaReport(xmlData);

    // Check if a report with this last_build_date already exists
    const existingReport = await this.findReportByBuildDate(
      parsedReport.lastBuildDate
    );

    if (existingReport) {
      // Report already exists - return it (idempotent behavior)
      return existingReport;
    }

    // No existing report found - insert new one
    const record = {
      last_build_date: parsedReport.lastBuildDate,
      discussion: parsedReport.discussion,
      wave_heights: parsedReport.waveHeights,
      raw_xml: xmlData,
      poem,
      model,
    };

    const { data, error } = await supabaseAdmin
      .from("surf_reports")
      .insert(record)
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to save surf report: ${error.message}`);
      Sentry.captureException(err, {
        tags: { service: "SurfReportServerService", method: "saveReport" },
        extra: {
          last_build_date: parsedReport.lastBuildDate,
          supabase_error: error,
          poem_length: poem.length,
          model,
        },
      });
      throw err;
    }

    return surfReportRecordSchema.parse(data);
  }

  /**
   * Update an existing report with new poem and model data
   */
  static async updateReport(
    reportId: string,
    xmlData: string,
    poem: string[],
    model: string
  ): Promise<SurfReportRecord> {
    const parsedReport = parseNoaaReport(xmlData);

    const updates = {
      discussion: parsedReport.discussion,
      wave_heights: parsedReport.waveHeights,
      raw_xml: xmlData,
      poem,
      model,
    };

    const { data, error } = await supabaseAdmin
      .from("surf_reports")
      .update(updates)
      .eq("id", reportId)
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to update surf report: ${error.message}`);
      Sentry.captureException(err, {
        tags: { service: "SurfReportServerService", method: "updateReport" },
        extra: {
          report_id: reportId,
          last_build_date: parsedReport.lastBuildDate,
          supabase_error: error,
          poem_length: poem.length,
          model,
        },
      });
      throw err;
    }

    return surfReportRecordSchema.parse(data);
  }

  static async updateAudioPath(
    reportId: string,
    audioPath: string
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from("surf_reports")
      .update({ audio_path: audioPath })
      .eq("id", reportId);

    if (error) {
      const err = new Error(`Failed to update audio path: ${error.message}`);
      Sentry.captureException(err, {
        tags: { service: "SurfReportServerService", method: "updateAudioPath" },
        extra: {
          report_id: reportId,
          audio_path: audioPath,
          supabase_error: error,
        },
      });
      throw err;
    }
  }
}
