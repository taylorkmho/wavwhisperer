import { usePlausible } from "next-plausible";
import React, { createContext, useContext, useRef, useState } from "react";
import { useCurrentReport } from "./CurrentReportContext";

interface AudioContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  progress: number;
  setProgress: (progress: number) => void;
  audioPath: string | null;
  setAudioPath: (audioPath: string | null) => void;
  error: string | null;
  isLoading: boolean;
  webAudioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
}

const AudioContextObj = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const webAudioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const plausible = usePlausible();
  const { currentReport } = useCurrentReport();

  const getReportId = () => {
    if (!currentReport) return null;
    return "id" in currentReport ? currentReport.id : null;
  };

  const setupAudioContext = async () => {
    if (!audioRef.current || sourceNodeRef.current) return;

    try {
      // Create AudioContext on first user interaction
      if (!webAudioContextRef.current) {
        webAudioContextRef.current = new AudioContext();
      }

      // Resume the audio context if it's suspended
      if (webAudioContextRef.current.state === "suspended") {
        await webAudioContextRef.current.resume();
      }

      // Create and connect nodes
      analyserNodeRef.current = webAudioContextRef.current.createAnalyser();
      analyserNodeRef.current.fftSize = 128;
      analyserNodeRef.current.smoothingTimeConstant = 0.7;

      sourceNodeRef.current =
        webAudioContextRef.current.createMediaElementSource(audioRef.current);

      sourceNodeRef.current.connect(analyserNodeRef.current);
      analyserNodeRef.current.connect(webAudioContextRef.current.destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to setup audio");
    }
  };

  const play = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await setupAudioContext();
        await audioRef.current.play();
        setIsPlaying(true);
        plausible("audio_play", { props: { reportId: getReportId() } });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to play audio");
        setError(error.message);
        setIsPlaying(false);
        plausible("audio_error", {
          props: { error: error.message, reportId: getReportId() },
        });
      }
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      plausible("audio_pause", { props: { reportId: getReportId() } });
    }
  };

  const handleAudioEnd = () => {
    setProgress(0);
    pause();
    plausible("audio_complete", { props: { reportId: getReportId() } });
  };

  const handleAudioStart = () => {
    setProgress(0);
    setError(null);
    plausible("audio_start", { props: { reportId: getReportId() } });
  };

  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    const audioElement = e.target as HTMLAudioElement;
    const errorMessage = audioElement.error?.message || "Failed to load audio";
    setError(errorMessage);
    setIsPlaying(false);
    setIsLoading(false);
    plausible("audio_error", {
      props: { error: errorMessage, reportId: getReportId() },
    });
  };

  const handleAudioLoadStart = () => {
    setIsLoading(true);
    setError(null);
    plausible("audio_loading", { props: { reportId: getReportId() } });
  };

  const handleAudioLoaded = () => {
    setIsLoading(false);
    setError(null);
    plausible("audio_loaded", { props: { reportId: getReportId() } });
  };

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      setProgress(progress);
      // Track progress at 25%, 50%, and 75% completion
      if (progress >= 0.25 && progress < 0.26) {
        plausible("audio_progress_25", { props: { reportId: getReportId() } });
      } else if (progress >= 0.5 && progress < 0.51) {
        plausible("audio_progress_50", { props: { reportId: getReportId() } });
      } else if (progress >= 0.75 && progress < 0.76) {
        plausible("audio_progress_75", { props: { reportId: getReportId() } });
      }
    }
  };

  return (
    <AudioContextObj.Provider
      value={{
        isPlaying,
        play,
        pause,
        audioRef,
        progress,
        setProgress,
        audioPath,
        setAudioPath,
        error,
        isLoading,
        webAudioContext: webAudioContextRef.current,
        analyserNode: analyserNodeRef.current,
      }}
    >
      <audio
        ref={audioRef}
        className="invisible"
        crossOrigin="anonymous"
        src={
          audioPath
            ? `https://mnegthmftttdlazyjbke.supabase.co/storage/v1/object/public/voiceover/${audioPath}`
            : undefined
        }
        onEnded={handleAudioEnd}
        onPlay={handleAudioStart}
        onTimeUpdate={updateAudioProgress}
        onError={handleAudioError}
        onLoadStart={handleAudioLoadStart}
        onLoadedData={handleAudioLoaded}
      />
      {children}
    </AudioContextObj.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContextObj);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
