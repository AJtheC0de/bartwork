"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Seconds before the reveal starts once in view. */
  delay?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start. */
  start?: string;
  id?: string;
};

/**
 * Line-by-line masked reveal. Text is split into lines inside clipping
 * masks and each line rises into place — it never simply fades in.
 * Re-splits responsively (autoSplit) and is skipped for reduced motion.
 */
export function RevealText({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  stagger = 0.11,
  duration = 1.25,
  start = "top 88%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let played = false;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            // After a resize re-split, keep already-revealed lines visible.
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 112,
              duration,
              stagger,
              delay,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                onEnter: () => {
                  played = true;
                },
              },
            });
          },
        });
        gsap.set(el, { visibility: "visible" });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
