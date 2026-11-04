"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis drives the page's scroll inertia; GSAP's ticker drives Lenis so
 * ScrollTrigger and smooth scrolling share a single rAF loop.
 * Disabled entirely for reduced-motion users (native scroll).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch devices keep native momentum (best on iOS).
        syncTouch: false,
        anchors: { offset: 0 },
        autoRaf: false,
      });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    if (!reduce.matches) start();
    const onChange = () => (reduce.matches ? stop() : start());
    reduce.addEventListener("change", onChange);

    return () => {
      reduce.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // On route change: jump to top (or hash target) and re-measure triggers.
  useEffect(() => {
    const changed = prevPath.current !== pathname;
    prevPath.current = pathname;
    if (changed && !window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
    }
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (changed && hash.length > 1) {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          // Wait one more frame so pin spacers exist before measuring.
          requestAnimationFrame(() => {
            if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
            else el.scrollIntoView();
          });
        }
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  // Re-measure once web fonts have settled (prevents trigger drift).
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
