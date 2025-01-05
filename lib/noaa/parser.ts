import {
  surfReportSchema,
  type SurfReport,
  type WaveHeight,
} from "@/types/noaa";
import { XMLParser } from "fast-xml-parser";

export function parseNoaaReport(xmlText: string): SurfReport {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
    trimValues: true,
  });

  const data = parser.parse(xmlText);
  const channel = data.rss.channel;

  // Get the forecast item for Oahu (main island)
  const forecastItem = channel.item.find(
    (item: { title: string }) => item.title === "Forecast for Oahu"
  );

  if (!forecastItem) {
    throw new Error("No forecast found");
  }

  // Get the discussion item
  const discussionItem = channel.item.find(
    (item: { title: string }) => item.title === "Discussion"
  );

  // Parse wave heights from the HTML table in the description
  const waveHeights = parseWaveHeights(forecastItem.description);

  // Parse discussion paragraphs
  const discussion = parseDiscussion(discussionItem.description);

  // Validate the parsed data
  const report = {
    lastBuildDate: channel.lastBuildDate,
    lastBuildDateObject: new Date(channel.lastBuildDate),
    discussion,
    waveHeights,
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
    if (!cells || cells.length < 3) return;

    const direction = cells[0]
      .replace(/<[^>]*>/g, "")
      .trim()
      .charAt(0);
    const currentHeight = cells[1].replace(/<[^>]*>/g, "").trim();
    const nextHeight = cells[2].replace(/<[^>]*>/g, "").trim();

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

function parseDiscussion(description: string): string[] {
  const paragraphs = description.match(/<p>(.*?)<\/p>/g);
  if (!paragraphs) return [];

  return paragraphs
    .map((p) => p.replace(/<[^>]*>/g, "").trim())
    .filter((p) => p.length > 0);
}
