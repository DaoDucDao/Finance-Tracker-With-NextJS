"use client";

import { useEffect, useState } from "react";

interface ConfettiProps {
  /** Bump this number to fire a fresh burst. */
  trigger: number;
  pieces?: number;
}

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
}

const COLORS = ["#22c55e", "#06b6d4", "#8b5cf6", "#f97316", "#ec4899", "#eab308"];

// Plain helper (not a component/hook) so the randomness lives outside render.
function makePieces(count: number): Piece[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2 + Math.random() * 1.5,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));
}

/**
 * Lightweight, dependency-free confetti burst. Renders a fixed-position
 * overlay of falling pieces whenever `trigger` changes, then clears itself.
 */
export default function Confetti({ trigger, pieces = 80 }: ConfettiProps) {
  const [burst, setBurst] = useState<Piece[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a burst is a one-shot side effect tied to `trigger`
    setBurst(makePieces(pieces));
    const timer = setTimeout(() => setBurst([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger, pieces]);

  if (burst.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {burst.map((c) => (
        <span
          key={c.id}
          className="absolute top-[-20px] animate-confetti-fall"
          style={{
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size * 0.6}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotate}deg)`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
}
