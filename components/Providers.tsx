"use client";

import { AudioProvider } from "@/components/SurfReport/AudioContext";
import { CurrentReportProvider } from "@/components/SurfReport/CurrentReportContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlausibleProvider from "next-plausible";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentReportProvider>
        <AudioProvider>
          <PlausibleProvider domain="tellaho.com">
            {children}
            <Toaster />
          </PlausibleProvider>
        </AudioProvider>
      </CurrentReportProvider>
    </QueryClientProvider>
  );
}
