"use client";

import { Providers } from "@/components/Providers";
import { SurfReportPage } from "@/components/SurfReportPage";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <Providers>
      <SurfReportPage id={params.id} />
    </Providers>
  );
}
