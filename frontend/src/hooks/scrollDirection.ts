import { useEffect, useState } from "react";

export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      if (Math.abs(diff) < threshold) return;

      setDirection(diff > 0 ? "down" : "up");
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
