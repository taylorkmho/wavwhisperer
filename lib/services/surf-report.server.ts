import { parseNoaaReport } from "@/lib/noaa/parser";
import {
  surfReportRecordSchema,
  type SurfReportRecord,
} from "@/types/database";
import { supabaseAdmin } from "../supabase/admin-client";

export class SurfReportServerService {
  static async saveReport(
    xmlData: string,
    poem: string[],
    model: string
  ): Promise<SurfReportRecord> {
    const parsedReport = parseNoaaReport(xmlData);

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
      throw new Error(`Failed to save surf report: ${error.message}`);
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
      throw new Error(`Failed to update audio path: ${error.message}`);
    }
  }
}
