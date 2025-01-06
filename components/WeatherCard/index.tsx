import { CloudRainWind, ThermometerSun } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";

import { Card } from "@/components/ui/card";

import { WeatherData } from "../../types/api";

interface WeatherCardProps {
  location?: {
    name: string;
    subtitle?: string;
  };
  weather?: WeatherData;
}

export default function WeatherCard({ location, weather }: WeatherCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        {/* Location and Temperature */}
        <div className="flex items-center justify-between">
          <span className="text-xl text-foreground">
            {location?.name || "Current Location"}
          </span>
          <div className="flex items-center gap-1">
            <ThermometerSun className="size-4 text-primary" />
            <span className="text-lg font-bold">{weather?.temp}°</span>
            <span className="text-xs text-muted-foreground">
              ({weather?.feels_like}°)
            </span>
          </div>
        </div>

        {/* Weather and Sun Info */}
        <div className="flex items-center justify-between text-xs">
          {location?.subtitle && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {location.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs">
              <CloudRainWind className="size-3 text-blue-500" />
              <span>{weather?.precipitation}&rdquo;</span>
            </span>
            <div className="flex items-center gap-1">
              {weather?.is_day ? (
                <FaSun className="size-2.5 text-yellow-400" />
              ) : (
                <FaMoon className="size-2.5 text-yellow-600" />
              )}
              <span>
                ↑{" "}
                {weather?.sunrise
                  ? new Date(weather.sunrise).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </span>
              <span>
                ↓{" "}
                {weather?.sunset
                  ? new Date(weather.sunset).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
