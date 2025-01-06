import { supabase } from "../supabase/client";
import {
  surfReportRecordSchema,
  type SurfReportRecord,
} from "@/types/database";

export class SurfReportClientService {
  static async getLatestReport(): Promise<SurfReportRecord | null> {
    const { data, error } = await supabase
      .from("surf_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Failed to fetch latest surf report: ${error.message}`);
    }

    return data ? surfReportRecordSchema.parse(data) : null;
  }
}
