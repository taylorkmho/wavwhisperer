export class WeatherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeatherError";
  }
}

export class WorkoutGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkoutGenerationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}
