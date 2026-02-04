/**
 * Sentry utility functions for consistent error tracking across the application
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Capture an error with context tags and extra data
 */
export function captureError(
  error: Error | unknown,
  context: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  } = {}
): void {
  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    level: context.level || "error",
  });
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
  });
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}
