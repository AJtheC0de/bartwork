"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Optional gallery cursor. The native cursor is always kept; this adds a
 * small label ("View artwork") that follows the pointer over elements with
 * `data-cursor="…"`. Only on fine pointers with hover, never with reduced motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] will-change-transform"
    >
      <div
        className={`t-label flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-center text-ink backdrop-blur-sm transition-[opacity,scale] duration-500 ease-[var(--ease-gallery)] ${
          label ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <span className="max-w-[9ch] leading-snug">{label}</span>
      </div>
    </div>
  );
}
