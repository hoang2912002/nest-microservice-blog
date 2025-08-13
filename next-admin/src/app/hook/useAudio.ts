// useAudio.ts
import { useEffect, useRef } from "react";

export function usePreloadedAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = 0.7;

    const unlockAudio = () => {
      audioRef.current!.muted = true;
      audioRef.current!.play().then(() => {
        audioRef.current!.pause();
        audioRef.current!.muted = false;
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("scroll", unlockAudio);
      });
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("scroll", unlockAudio);
  }, [src]);

  return audioRef;
}
