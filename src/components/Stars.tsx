'use client';

import { useEffect, useRef } from "react";

type StarsProps = {
  count?: number;
};

export default function Stars({ count = 100 }: StarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = ""; // clear stars

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      container.appendChild(star);
    }
  }, [count]);

  return <div ref={containerRef} className="stars-container absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />;
}
