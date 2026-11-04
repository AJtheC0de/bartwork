"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { introStore } from "@/lib/intro";
import { copy } from "@/content/site";
import { displayTitle, featuredArtworks } from "@/content/artworks";

/**
 * CHAPTER 02 — THE HERO
 * The painting hangs in a quiet frame. Scrolling (scrubbed, reversible)
 * lifts the headline away and lets the artwork grow until it fills the
 * screen, becoming the bridge into the next chapter.
 *
 * The frame grows via width (not scale) so the painting is always
 * rasterised at its displayed size and stays sharp at full screen.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = featuredArtworks[0];

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !art) return;
      const q = gsap.utils.selector(el);
      const frame = q("[data-hero-art]")[0] as HTMLElement;
      // The shadow plate always keeps the CSS frame width — measure it.
      const plate = q("[data-hero-shadow]")[0] as HTMLElement;
      const ratio = art.image.src.width / art.image.src.height;

      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        /* Entrance — waits for the opening sequence to hand over. */
        const entrance = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        entrance
          .fromTo(q("[data-hero-line]"), { y: 0, yPercent: 112 }, { y: 0, yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.1)
          .fromTo(q("[data-hero-fade]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.5);
        if (!introStore.didPlay()) {
          entrance
            .fromTo(
              frame,
              { clipPath: "inset(50% 50% 50% 50%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" },
              0,
            )
            .fromTo(q("[data-hero-img]"), { scale: 1.35 }, { scale: 1.12, duration: 2.2 }, 0);
        } else {
          gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
        }
        const off = introStore.onDone(() => entrance.play());

        /* Scroll choreography — pinned & scrubbed. */
        const cover = () => Math.max(window.innerWidth, window.innerHeight * ratio);
        const scroll = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        scroll
          .to(q("[data-hero-scroll='a']"), { yPercent: -60, xPercent: -6, autoAlpha: 0, duration: 0.38 }, 0)
          .to(q("[data-hero-scroll='b']"), { yPercent: -40, xPercent: 6, autoAlpha: 0, duration: 0.38 }, 0.03)
          .to(q("[data-hero-scroll='meta']"), { autoAlpha: 0, y: -16, duration: 0.2 }, 0)
          .fromTo(
            frame,
            { width: () => plate.getBoundingClientRect().width },
            { width: cover, duration: 0.85, ease: "power2.inOut" },
            0.04,
          )
          .to(q("[data-hero-shadow]"), { autoAlpha: 0, duration: 0.4 }, 0.1)
          .fromTo(q("[data-hero-img]"), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
          .fromTo(
            q("[data-hero-caption]"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.15 },
            0.82,
          );

        return () => off();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  if (!art) return null;

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-paper"
    >
      {/* Artwork */}
      <div
        data-hero-art
        className="absolute top-1/2 left-1/2 z-0 w-[var(--hero-frame-w)] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{ aspectRatio: `${art.image.src.width} / ${art.image.src.height}` }}
      >
        <div data-hero-img className="absolute inset-0 scale-[1.12]">
          <Image
            src={art.image.src}
            alt={art.image.alt}
            fill
            preload
            quality={90}
            placeholder="blur"
            sizes="(orientation: portrait) 160svh, 100vw"
            className="object-cover"
          />
        </div>
        <div
          data-hero-caption
          className="invisible absolute bottom-[var(--gutter)] left-[var(--gutter)] flex items-center gap-4 bg-paper/92 px-4 py-3 opacity-0"
        >
          <span className="t-num text-mute">01</span>
          <span className="t-label text-ink">{displayTitle(art)}</span>
        </div>
      </div>
      <div
        data-hero-shadow
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-0 w-[var(--hero-frame-w)] -translate-x-1/2 -translate-y-1/2 shadow-[0_40px_80px_-40px_rgb(23_25_26/0.45)]"
        style={{ aspectRatio: `${art.image.src.width} / ${art.image.src.height}` }}
      />

      {/* Typography */}
      <div className="pointer-events-none relative z-10 h-full">
        <div
          data-hero-scroll="meta"
          className="gutter absolute top-[calc(var(--header-h)+1.5rem)] left-0 flex w-full items-start justify-between"
        >
          <span data-hero-fade className="t-label text-ink">
            {copy.hero.label}
          </span>
          <span data-hero-fade className="t-num hidden text-mute md:block">
            Paintings &amp; calligraphy
          </span>
        </div>

        <h1 id="hero-title" className="t-h1 text-ink">
          <span
            data-hero-scroll="a"
            className="gutter absolute top-[max(17svh,calc(var(--header-h)+4.5rem))] left-0 md:top-[19svh] lg:top-[15svh]"
          >
            <span className="mask-line">
              <span data-hero-line className="block">
                {copy.hero.headline[0]}
              </span>
            </span>
          </span>
          <span
            data-hero-scroll="b"
            className="gutter absolute right-0 bottom-[22svh] text-right md:bottom-[17svh] lg:bottom-[13svh]"
          >
            <span className="mask-line">
              <span data-hero-line className="block italic">
                {copy.hero.headline[1]}
              </span>
            </span>
          </span>
        </h1>

        <div
          data-hero-scroll="meta"
          className="gutter absolute bottom-0 left-0 flex w-full items-end justify-between pb-6 md:pb-8"
        >
          <p data-hero-fade className="t-lead max-w-[16ch] text-ink md:max-w-[22ch]">
            {copy.hero.sub}
          </p>
          <div data-hero-fade className="flex flex-col items-center gap-3">
            <span className="t-label hidden text-mute sm:block [writing-mode:vertical-rl]">
              Scroll to explore
            </span>
            <span className="relative block h-12 w-px overflow-hidden bg-ink/15">
              <span className="scroll-line absolute inset-0 bg-ink" />
            </span>
            <span className="sr-only">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}
