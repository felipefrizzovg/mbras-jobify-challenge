import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);

    setMatches(media.matches);

    if (media.addEventListener) {
      media.addEventListener('change', listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      }
    };
  }, [query]);

  return matches;
}