"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
};

/** Quiet fade-and-rise for supporting blocks (captions, paragraphs, CTAs). */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 24,
  start = "top 90%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        if (!el) return;
        // Opacity only (never visibility) so hidden content stays focusable.
        const tween = gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
        // Keyboard users tabbing ahead of the scroll see content at once.
        const onFocus = () => tween.progress(1);
        el.addEventListener("focusin", onFocus);
        return () => el.removeEventListener("focusin", onFocus);
      });
      mm.add(MQ.reduced, () => {
        gsap.set(ref.current, { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="fade">
      {children}
    </Tag>
  );
}
