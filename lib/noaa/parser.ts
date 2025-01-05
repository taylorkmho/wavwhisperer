import {
  GeneralDayInfo,
  surfReportSchema,
  WaveHeight,
  type SurfReport,
} from "@/types/noaa";
import { XMLParser } from "fast-xml-parser";

interface ForecastItem {
  title: string;
  description: string;
}

export function parseNoaaReport(xmlText: string, island: string): SurfReport {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
    trimValues: true,
  });

  const data = parser.parse(xmlText);
  const channel = data.rss.channel;

  // Get the forecast item for the specified island
  const forecastItem = channel.item.find(
    (item: ForecastItem) =>
      item.title === `Forecast for ${capitalizeFirstLetter(island)}`
  );

  if (!forecastItem) {
    throw new Error(`No forecast found for ${island}`);
  }

  // Get the discussion item
  const discussionItem = channel.item.find(
    (item: ForecastItem) => item.title === "Discussion"
  );

  // Parse wave heights from the HTML table in the description
  const waveHeights = parseWaveHeights(forecastItem.description);

  // Parse general day info from the description
  const generalDayInfo = parseGeneralDayInfo(forecastItem.description);

  // Parse discussion paragraphs
  const discussion = parseDiscussion(discussionItem.description);

  // Validate the parsed data
  const report = {
    lastBuildDate: channel.lastBuildDate,
    lastBuildDateObject: new Date(channel.lastBuildDate),
    discussion,
    waveHeights,
    generalDayInfo,
  };

  // This will throw if validation fails
  return surfReportSchema.parse(report);
}

function parseWaveHeights(description: string): WaveHeight[] {
  const waveHeights: WaveHeight[] = [];
  const tableMatch = description.match(/<table[^>]*>.*?<\/table>/s);

  if (!tableMatch) return waveHeights;

  const rows = tableMatch[0].match(/<tr.*?<\/tr>/gs);
  if (!rows) return waveHeights;

  // Skip header rows (first 3)
  const dataRows = rows.slice(3);

  dataRows.forEach((row, index) => {
    const cells = row.match(/<td[^>]*>(.*?)<\/td>/g);
    if (!cells || cells.length < 3) return; // We only need first 3 cells now

    const direction = cells[0]
      .replace(/<[^>]*>/g, "")
      .trim()
      .charAt(0);
    const currentHeight = cells[1].replace(/<[^>]*>/g, "").trim(); // Tonight PM
    const nextHeight = cells[2].replace(/<[^>]*>/g, "").trim(); // Tonight AM

    // Only process Tonight PM with its trend
    const [currentMin, currentMax] = currentHeight
      .split("-")
      .map((n) => parseFloat(n));
    const [nextMin, nextMax] = nextHeight.split("-").map((n) => parseFloat(n));

    const currentAvg = (currentMin + currentMax) / 2;
    const nextAvg = (nextMin + nextMax) / 2;

    // Determine trend
    let trend: "increasing" | "decreasing" | "steady" = "steady";
    const difference = nextAvg - currentAvg;
    const threshold = 0.5;

    if (Math.abs(difference) > threshold) {
      trend = difference > 0 ? "increasing" : "decreasing";
    }

    waveHeights.push({
      direction,
      height: currentHeight,
      minHeight: currentMin,
      maxHeight: currentMax,
      trend,
      order: index,
    });
  });

  return waveHeights.sort((a, b) => a.order - b.order);
}

function parseGeneralDayInfo(description: string): GeneralDayInfo[] {
  const generalInfo: GeneralDayInfo[] = [];
  const sections = description.match(/<div[^>]*>.*?<\/div>/gs);

  if (!sections) return generalInfo;

  sections.forEach((section) => {
    const dayMatch = section.match(/<span[^>]*><strong>(.*?)<\/strong>/);
    if (!dayMatch) return;

    const day = dayMatch[1];
    const info: GeneralDayInfo = {
      day,
      weather: extractField(section, "Weather"),
      temperature: extractField(section, "Temperature"),
      winds: extractField(section, "Winds"),
      sunrise: extractField(section, "Sunrise"),
      sunset: extractField(section, "Sunset"),
    };

    if (Object.values(info).some((value) => value)) {
      generalInfo.push(info);
    }
  });

  return generalInfo;
}

function parseDiscussion(description: string): string[] {
  const paragraphs = description.match(/<p>(.*?)<\/p>/g);
  if (!paragraphs) return [];

  return paragraphs
    .map((p) => p.replace(/<[^>]*>/g, "").trim())
    .filter((p) => p.length > 0);
}

function extractField(section: string, field: string): string {
  const match = section.match(
    new RegExp(`${field}[^>]*<\/th><td[^>]*>(.*?)<\/td>`)
  );
  return match ? match[1].trim() : "";
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
