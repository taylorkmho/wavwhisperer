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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const play = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
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
      }}
    >
      <audio
        ref={audioRef}
        className="invisible"
        src={`https://mnegthmftttdlazyjbke.supabase.co/storage/v1/object/public/voiceover/${audioPath}`}
        onEnded={handleAudioEnd}
        onPlay={handleAudioStart}
        onTimeUpdate={updateAudioProgress}
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
