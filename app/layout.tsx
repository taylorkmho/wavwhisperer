import { fontPixel, fontSans, fontSerif } from "@/lib/fonts";
import type { Metadata } from "next/types";
import * as Sentry from "@sentry/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wav Whisperer",
  description: "Forecasting the future surf",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontPixel.variable} ${fontSans.className} dark antialiased`}
      >
        <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            return (
              <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <h1 className="mb-4 text-2xl font-bold text-white">
                  Something went wrong
                </h1>
                <p className="mb-4 text-gray-400">{errorMessage}</p>
                <button
                  onClick={resetError}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Try again
                </button>
              </div>
            );
          }}
        >
          <main className="relative">{children}</main>
        </Sentry.ErrorBoundary>
      </body>
    </html>
  );
}
