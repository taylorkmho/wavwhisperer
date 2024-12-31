export const WORKOUT_CONFIG = {
  MIN_DURATION: 15,
  MAX_DURATION: 90,
  DEFAULT_DURATION: 45,
  WEATHER_STALE_TIME: 1000 * 60 * 5, // 5 minutes
  WEATHER_CACHE_TIME: 1000 * 60 * 30, // 30 minutes
};

export const EXERCISE_DEFAULTS = {
  WARMUP_SETS: 2,
  WARMUP_REPS: 10,
  REST_SECONDS: 90,
  FINISHER_DURATION: 5,
};

export const API_ENDPOINTS = {
  WEATHER: "/api/workout/weather",
  GENERATE: "/api/workout/generate",
} as const;
