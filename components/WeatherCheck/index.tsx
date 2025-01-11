"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Typewriter } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { generateWeatherResponse } from "@/lib/openai/functions";

import { useWeather } from "../../hooks/useWeather";
import WeatherCard from "../WeatherCard";

const LOCATIONS = {
  SF: { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
  KAILUA: { lat: 21.4022, lon: -157.7394, name: "Kailua" },
};

export default function WeatherCheck() {
  const [showUserWeather, setShowUserWeather] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationComparison, setLocationComparison] = useState("");

  const { data: sfWeather } = useWeather(LOCATIONS.SF.lat, LOCATIONS.SF.lon);
  const { data: kailuaWeather } = useWeather(
    LOCATIONS.KAILUA.lat,
    LOCATIONS.KAILUA.lon
  );
  const { data: userWeather } = useWeather(
    userLocation?.lat,
    userLocation?.lon
  );

  useEffect(() => {
    if (showUserWeather && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setShowUserWeather(false);
        }
      );
    }
  }, [showUserWeather, userLocation]);

  useEffect(() => {
    if (!sfWeather || !kailuaWeather) {
      setLocationComparison("");
      return;
    }

    const getResponse = async () => {
      const response = await generateWeatherResponse({
        sfWeather,
        kailuaWeather,
      });
      setLocationComparison(response);
    };
    getResponse();
  }, [sfWeather, kailuaWeather]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            weather: sfWeather,
            location: {
              name: LOCATIONS.SF.name,
              subtitle: "Where I Live",
            },
          },
          {
            weather: kailuaWeather,
            location: {
              name: LOCATIONS.KAILUA.name,
              subtitle: "Where I'm From",
            },
          },
        ].map(({ weather, location }) => (
          <WeatherCard
            key={location.name}
            weather={weather}
            location={location}
          />
        ))}
      </div>
      {locationComparison && (
        <div className="space-y-4 text-lg">
          <Typewriter text={locationComparison} />
        </div>
      )}
      {!showUserWeather && (
        <Button
          variant="secondary"
          onClick={() => setShowUserWeather(true)}
          className="mt-4"
        >
          Want me to check the weather in your area?
        </Button>
      )}

      {showUserWeather && (
        <WeatherCard
          weather={userWeather}
          location={{
            name: "Your Location",
          }}
        />
      )}
    </motion.div>
  );
}
