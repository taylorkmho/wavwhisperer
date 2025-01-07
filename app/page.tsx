"use client";

import { Typewriter } from "@/components/typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SurfReport from "@/components/SurfReport";
import { FaGithub, FaGithubAlt } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="font-semibold">
        <section>
          <div className="fixed bottom-4 left-4 z-10">
            <Button variant="secondary" size="icon" asChild>
              <Link
                href="https://github.com/taylorkmho/wavewhisperer"
                target="_blank"
              >
                <FaGithub className="size-4" />
              </Link>
            </Button>
          </div>
          <SurfReport />
        </section>
      </main>
    </QueryClientProvider>
  );
}
