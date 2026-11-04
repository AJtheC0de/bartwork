"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Travel in percent of the element's own height. Keep it subtle. */
  amount?: number;
  /** Also apply a slight scale so edges never show while moving. */
  scale?: number;
};

/** Scroll-linked vertical drift for depth. Transform-only, reversible. */
export function Parallax({ children, className, amount = 8, scale = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -amount, scale },
          {
            yPercent: amount,
            scale,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current?.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
