import React, { createContext, useContext, useRef, useState } from "react";

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const play = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        setError(err.message);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setProgress(0);
    pause();
  };

  const handleAudioStart = () => {
    setProgress(0);
    setError(null);
  };

  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    const audioElement = e.target as HTMLAudioElement;
    setError(audioElement.error?.message || "Failed to load audio");
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleAudioLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleAudioLoaded = () => {
    setIsLoading(false);
    setError(null);
  };

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      setProgress(progress);
    }
  };

  return (
    <AudioContext.Provider
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
      }}
    >
      <audio
        ref={audioRef}
        className="invisible"
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
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
