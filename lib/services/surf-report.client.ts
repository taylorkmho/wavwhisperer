import {
  surfReportRecordSchema,
  type SurfReportRecord,
} from "@/types/database";
import { supabase } from "../supabase/client";

export class SurfReportClientService {
  static async getReport(id?: string): Promise<SurfReportRecord | null> {
    const query = supabase
      .from("surf_reports")
      .select(
        "id, last_build_date, discussion, wave_heights, poem, model, audio_path"
      );

    if (id) {
      query.eq("id", id);
    } else {
      query.order("created_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(
        `Failed to fetch surf report${id ? ` by id ${id}` : ""}: ${error.message}`
      );
    }

    return data ? surfReportRecordSchema.parse(data) : null;
  }

  static async getRecentReports(
    limit: number = 5
  ): Promise<SurfReportRecord[]> {
    const { data, error } = await supabase
      .from("surf_reports")
      .select(
        "id, last_build_date, discussion, wave_heights, poem, model, audio_path"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent surf reports: ${error.message}`);
    }

    return data
      ? data.map((report) => surfReportRecordSchema.parse(report))
      : [];
  }
}
