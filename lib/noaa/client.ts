const NOAA_URL = "https://www.weather.gov/source/hfo/xml/SurfState.xml";

export async function fetchNoaaReport(): Promise<string> {
  const response = await fetch(NOAA_URL);
  if (!response.ok) {
    throw new Error(
      `NOAA fetch failed: ${response.status} ${response.statusText}`
    );
  }

  const xmlText = await response.text();
  console.log("Received XML length:", xmlText.length);

  return xmlText;
}
