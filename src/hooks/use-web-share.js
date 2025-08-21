import { useCallback } from "react";

export const useWebShare = () => {
  const share = useCallback(async (data) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url,
        });
        return true;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
        return false;
      }
    }
    return false;
  }, []);

  const canShare = typeof navigator !== "undefined" && navigator.share;

  return { share, canShare };
};
