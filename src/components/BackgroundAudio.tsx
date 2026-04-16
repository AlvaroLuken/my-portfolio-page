"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BackgroundAudioProps = {
  src: string;
  className?: string;
};

export default function BackgroundAudio({ src, className }: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setHasError(false);
    } catch {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setHasError(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      void togglePlayback();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlayback]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />
      <button
        type="button"
        className={`terrain-audio-control ${isPlaying ? "is-playing" : "is-idle"} ${className ?? ""}`.trim()}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        onClick={() => {
          void togglePlayback();
        }}
      >
        {hasError
          ? "Music Error 🐈 (Press 'Space' to try again)"
          : isPlaying
            ? "Stop Music 🐈 (Press 'Space' to pause)"
            : "Play Music 🐈 (Press 'Space' to play)"}
      </button>
    </>
  );
}
