import { NextResponse } from "next/server";
import { generateSurfLimerick } from "@/lib/openai/client";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { generationRecordSchema } from "@/types/database";

export async function POST(request: Request) {
  try {
    const { discussion, surfReportId } = await request.json();

    if (!discussion || !surfReportId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const { poem, model } = await generateSurfLimerick(discussion);

    // Save to database using service role client (which is only available server-side)
    const { data, error } = await supabaseAdmin
      .from("generations")
      .insert({
        surf_report_id: surfReportId,
        poem,
        model,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save generation: ${error.message}`);
    }

    return NextResponse.json(generationRecordSchema.parse(data));
  } catch (error) {
    console.error("Generation error:", error);
    return new NextResponse("Failed to generate poem", { status: 500 });
  }
}
