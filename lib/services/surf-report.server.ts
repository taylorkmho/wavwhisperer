import { supabaseAdmin } from "../supabase/admin-client";
import {
  surfReportRecordSchema,
  type SurfReportRecord,
} from "@/types/database";
import { parseNoaaReport } from "@/lib/noaa/parser";

export class SurfReportServerService {
  static async saveReport(xmlData: string): Promise<SurfReportRecord> {
    const parsedReport = parseNoaaReport(xmlData);

    const record = {
      last_build_date: parsedReport.lastBuildDate,
      discussion: parsedReport.discussion,
      wave_heights: parsedReport.waveHeights,
      raw_xml: xmlData,
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
}
