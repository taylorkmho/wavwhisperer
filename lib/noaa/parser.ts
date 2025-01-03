import { SurfReport, WaveHeight, GeneralDayInfo } from "@/types/noaa";
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

  return {
    lastBuildDate: channel.lastBuildDate,
    lastBuildDateObject: new Date(channel.lastBuildDate),
    discussion,
    waveHeights,
    generalDayInfo,
  };
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
    if (!cells || cells.length < 5) return;

    const direction = cells[0].replace(/<[^>]*>/g, "").trim();
    const pmHeight = cells[1].replace(/<[^>]*>/g, "").trim();
    const amHeight = cells[2].replace(/<[^>]*>/g, "").trim();
    const nextAmHeight = cells[3].replace(/<[^>]*>/g, "").trim();
    const nextPmHeight = cells[4].replace(/<[^>]*>/g, "").trim();

    // Add PM height
    addWaveHeight(waveHeights, direction, "PM", "Tonight", pmHeight, index);
    // Add AM height
    addWaveHeight(waveHeights, direction, "AM", "Tonight", amHeight, index);
    // Add next day AM height
    addWaveHeight(
      waveHeights,
      direction,
      "AM",
      "Tomorrow",
      nextAmHeight,
      index
    );
    // Add next day PM height
    addWaveHeight(
      waveHeights,
      direction,
      "PM",
      "Tomorrow",
      nextPmHeight,
      index
    );
  });

  return waveHeights.sort((a, b) => a.order - b.order);
}

function addWaveHeight(
  waveHeights: WaveHeight[],
  direction: string,
  time: string,
  day: string,
  height: string,
  order: number
) {
  const [min, max] = height.split("-").map((n) => parseFloat(n));
  waveHeights.push({
    direction,
    day,
    time,
    height,
    minHeight: min,
    maxHeight: max,
    averageHeight: (min + max) / 2,
    order,
  });
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
