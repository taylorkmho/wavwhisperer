"use client";

import { useEffect, useState } from "react";
import { Cloud, Loader2, MapPin, ThermometerSun } from "lucide-react";

import { Card } from "@/components/ui/card";

import { useWeather } from "../../hooks/useWeather";

export default function WeatherCard() {
  const [location, setLocation] = useState<GeolocationPosition>();
  const {
    data: weather,
    isLoading,
    error,
  } = useWeather(location?.coords.latitude, location?.coords.longitude);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position);
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6">
        <Loader2 className="size-4 animate-spin" />
        <span className="ml-2">Checking weather...</span>
      </Card>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 size-4" />
            <span>Current Location</span>
          </div>
          <div className="flex items-center">
            <Cloud className="mr-2 size-5" />
            <span className="font-medium">{weather.precipitation}“ rain</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end">
            <ThermometerSun className="mr-1 size-5" />
            <span className="text-2xl font-bold">{weather.temp}°F</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Feels like {weather.feels_like}°F
          </div>
        </div>
      </div>
    </Card>
  );
}
