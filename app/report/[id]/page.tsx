"use client";

import { Providers } from "@/components/Providers";
import { SurfReport } from "@/components/SurfReport";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <Providers>
      <SurfReport id={params.id} />
    </Providers>
  );
}
