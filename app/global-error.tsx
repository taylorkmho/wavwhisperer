"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Something went wrong
          </h1>
          <p className="mb-4 text-gray-400">{error.message}</p>
          {error.digest && (
            <p className="mb-4 text-sm text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
