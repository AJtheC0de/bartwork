"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { introStore } from "@/lib/intro";
import { featuredArtworks } from "@/content/artworks";
import { useLenis } from "@/components/motion/SmoothScroll";

const WORD = "BLERTA";

/**
 * CHAPTER 01 — THE OPENING
 * A short (~3s), skippable sequence shown once per session. The painting
 * emerges at the exact size and position of the hero artwork, so when the
 * curtain lifts the painting simply stays — the gallery appears around it.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const art = featuredArtworks[0];
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && tl.current && tl.current.progress() < 1) lenis.stop();
  }, [lenis]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Already seen this session, reduced motion, or deep link: skip.
      if (document.documentElement.dataset.intro === "seen") {
        introStore.finish();
        return;
      }

      introStore.markPlaying();
      const chars = el.querySelectorAll("[data-intro-char]");
      const label = el.querySelector("[data-intro-label]");
      const painting = el.querySelector("[data-intro-art]");
      const skip = el.querySelector("[data-intro-skip]");

      const t = gsap.timeline({ defaults: { ease: "expo.out" } });
      // y: 0 discards the CSS start offset GSAP would otherwise parse as px.
      t.fromTo(chars, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.15)
        .fromTo(label, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1 }, 0.55)
        .to(skip, { autoAlpha: 1, duration: 0.6 }, 0.4)
        .fromTo(
          painting,
          { clipPath: "inset(50% 50% 50% 50%)", scale: 1.25 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.6, ease: "expo.inOut" },
          0.7,
        )
        .to(chars, { yPercent: -110, duration: 0.9, stagger: 0.035, ease: "expo.in" }, 2.45)
        .to(label, { yPercent: -110, duration: 0.7, ease: "expo.in" }, 2.45)
        .to(skip, { autoAlpha: 0, duration: 0.3 }, 2.45)
        .add(() => introStore.finish(), 3.1)
        .to(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" },
          3.1,
        )
        // The painting stays still: the curtain edge sweeps across two
        // identical images (intro + hero), so the hand-over is invisible.
        .set(el, { display: "none" });

      tl.current = t;
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
      const release = () => {
        document.documentElement.style.overflow = "";
        document.documentElement.dataset.intro = "seen";
        lenisRef.current?.start();
      };
      t.eventCallback("onComplete", release);
      return () => {
        t.kill();
        release();
        introStore.finish();
      };
    },
    { scope: root },
  );

  // Allow skipping with Escape as well as the button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipIntro();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function skipIntro() {
    const t = tl.current;
    if (!t || t.progress() === 1) return;
    // Jump to the curtain so the skip still feels designed, then speed up.
    if (t.time() < 3.1) t.seek(3.1);
    t.timeScale(1.6);
  }

  return (
    <div
      ref={root}
      data-intro-root
      className="fixed inset-0 z-[60] items-center justify-center bg-paper"
    >
      {art ? (
        <div
          aria-hidden
          data-intro-art
          className="absolute top-1/2 left-1/2 w-[var(--hero-frame-w)] -translate-x-1/2 -translate-y-1/2"
          style={{ aspectRatio: `${art.image.src.width} / ${art.image.src.height}`, clipPath: "inset(50% 50% 50% 50%)" }}
        >
          <Image
            src={art.image.src}
            alt=""
            fill
            preload
            sizes="(max-width: 767px) 80vw, 40vw"
            className="object-cover"
            placeholder="blur"
          />
        </div>
      ) : null}

      <div className="relative flex flex-col items-center">
        <p className="t-display flex text-ink" aria-hidden>
          {WORD.split("").map((c, i) => (
            <span key={i} className="mask-line inline-block">
              <span data-intro-char className="inline-block translate-y-[110%]">
                {c}
              </span>
            </span>
          ))}
        </p>
        <span className="mask-line mt-5 md:mt-8">
          <span data-intro-label className="t-label block translate-y-[110%] text-ink">
            Artist &amp; Creator
          </span>
        </span>
      </div>

      <button
        type="button"
        data-intro-skip
        onClick={skipIntro}
        className="t-label invisible absolute right-[var(--gutter)] bottom-6 min-h-12 px-2 text-mute opacity-0 hover:text-ink"
      >
        Skip intro
      </button>
    </div>
  );
}
