export type WaveHeight = {
  direction: string;
  day: string;
  time: string;
  height: string;
  minHeight: number;
  maxHeight: number;
  averageHeight: number;
  order: number;
};

export type GeneralDayInfo = {
  day: string;
  weather: string;
  temperature: string;
  winds: string;
  sunrise: string;
  sunset: string;
};

export type SurfReport = {
  lastBuildDate: string;
  lastBuildDateObject: Date;
  discussion: string[];
  waveHeights: WaveHeight[];
  generalDayInfo: GeneralDayInfo[];
};
