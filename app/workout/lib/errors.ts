export class WorkoutGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkoutGenerationError";
  }
}

export class WeatherFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeatherFetchError";
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    throw new WorkoutGenerationError(error.message);
  }
  throw new WorkoutGenerationError("An unexpected error occurred");
}
