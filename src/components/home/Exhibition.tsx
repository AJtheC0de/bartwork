"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { displayTitle, featuredArtworks, TBC } from "@/content/artworks";

const BG = ["var(--color-paper)", "var(--color-ivory)"];
const CONTAIN_BG = "#1a1719";

/** Frame sizes — mirror the `.exh-frame` CSS so JS and CSS agree. */
const isDesktop = () => window.innerWidth >= 1024;
const vw = () => window.innerWidth;
const vh = () => window.innerHeight;

/**
 * CHAPTER 04 — THE ARTWORK EXPERIENCE
 * A pinned, scrubbed exhibition. For each featured work:
 *   enter (curtain wipe) → text rises through masks → the frame expands
 *   towards fullscreen → a slow zoom into the paint surface → next work.
 * Works marked `fit: "contain"` (calligraphy) are never cropped: they
 * settle, whole, onto a dark wall.
 */
export function Exhibition() {
  const root = useRef<HTMLElement>(null);
  const works = featuredArtworks;

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !works.length) return;
      const q = gsap.utils.selector(el);
      const slides = q<HTMLElement>(".exh-slide");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // First slide's text rises as the stage arrives (not scrubbed).
        const firstLines = slides[0].querySelectorAll("[data-exh-line]");
        gsap.fromTo(
          firstLines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.3,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 55%", toggleActions: "play none none reverse" },
          },
        );

        let units = 0;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".exh-stage")[0],
            start: "top top",
            // Evaluated on refresh, after the timeline has been built.
            end: () => `+=${Math.round(units * 0.46 * vh())}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        slides.forEach((slide, i) => {
          const art = works[i];
          const ratio = art.image.src.width / art.image.src.height;
          const contain = art.fit === "contain";
          const frame = slide.querySelector<HTMLElement>(".exh-frame")!;
          const inner = slide.querySelector<HTMLElement>("[data-exh-inner]")!;
          const lines = slide.querySelectorAll("[data-exh-line]");
          const text = slide.querySelector<HTMLElement>(".exh-text")!;
          const caption = slide.querySelector<HTMLElement>(".exh-caption")!;
          const bgEl = slide.querySelector<HTMLElement>("[data-exh-bg]")!;

          const startW = () =>
            isDesktop() ? Math.min(vw() * 0.44, vh() * 0.58 * 1.5) : Math.min(vw() * 0.84, vh() * 0.44 * 1.5);
          const endW = () =>
            contain
              ? Math.min(vw() * (isDesktop() ? 0.8 : 0.92), vh() * 0.76 * ratio)
              : Math.max(vw(), vh() * ratio);
          const offX = () => (isDesktop() ? vw() * 0.15 : 0);
          const offY = () => (isDesktop() ? 0 : -vh() * 0.13);

          gsap.set(frame, { xPercent: -50, yPercent: -50, x: offX, y: offY, width: startW });

          const at = units;
          if (i > 0) {
            const prev = slides[i - 1];
            tl.fromTo(
              slide,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" },
              at,
            )
              .to(prev.querySelector("[data-exh-content]"), { yPercent: -12, duration: 1, ease: "power2.in" }, at)
              .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, at + 0.55);
            units += 1.3;
          }

          // Hold so the composition can be read.
          units += 0.35;

          // Expand.
          tl.to(text, { autoAlpha: 0, y: -30, duration: 0.5, ease: "power2.in" }, units)
            .fromTo(
              frame,
              { width: startW, x: offX, y: offY },
              { width: endW, x: 0, y: 0, duration: 1.4, ease: "power2.inOut" },
              units,
            )
            .fromTo(inner, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power2.inOut" }, units);
          if (contain) {
            tl.to(bgEl, { backgroundColor: CONTAIN_BG, duration: 1.2, ease: "power1.inOut" }, units + 0.2);
          }
          units += 1.4;

          // Texture: a slow approach to the surface of the paint.
          tl.to(inner, { scale: art.textureZoom ?? 1.6, duration: 1.4, ease: "power1.inOut" }, units).fromTo(
            caption,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
            units + 0.3,
          );
          units += 1.4;

          // Linger before the next work.
          units += 0.45;
          if (i === slides.length - 1) {
            tl.to(caption, { autoAlpha: 0, duration: 0.3 }, units - 0.3);
          }
        });

        // Progress hairline + counter.
        tl.fromTo(q("[data-exh-progress]"), { scaleX: 0 }, { scaleX: 1, duration: units, ease: "none" }, 0);
        tl.eventCallback("onUpdate", () => {
          const c = q("[data-exh-count]")[0];
          if (!c) return;
          const idx = Math.min(slides.length - 1, Math.floor(tl.progress() * slides.length * 0.9999));
          c.textContent = String(idx + 1).padStart(2, "0");
        });

      });

      return () => mm.revert();
    },
    { scope: root },
  );

  if (!works.length) return null;

  return (
    <section ref={root} id="exhibition" aria-labelledby="exh-title" className="relative">
      <h2 id="exh-title" className="sr-only">
        The exhibition — selected works
      </h2>
      <div className="exh-stage">
        {works.map((art, i) => {
          const title = displayTitle(art);
          const focus = art.textureFocus ?? { x: 50, y: 50 };
          return (
            <article
              key={art.slug}
              className="exh-slide"
              style={{ zIndex: i + 1, ["--slide-bg" as string]: BG[i % 2] }}
              aria-label={`${art.number} — ${title}`}
            >
              <div data-exh-bg aria-hidden className="absolute inset-0" style={{ background: BG[i % 2] }} />
              <div data-exh-content className="exh-content">
                <div className="exh-text relative z-10 lg:order-first">
                  <p className="t-num mb-6 flex items-center gap-3 text-mute md:mb-8">
                    <span className="mask-line">
                      <span data-exh-line className="block">
                        {art.number} / Selected work
                      </span>
                    </span>
                  </p>
                  <h3 className="t-h2 text-ink">
                    <span className="mask-line">
                      <span data-exh-line className="block">
                        {title}
                      </span>
                    </span>
                  </h3>
                  <dl className="t-label mt-6 grid max-w-[34ch] gap-1.5 text-mute md:mt-10">
                    <div className="mask-line">
                      <div data-exh-line className="flex gap-2">
                        <dt className="sr-only">Medium</dt>
                        <dd>{art.medium ?? `Medium — ${TBC.toLowerCase()}`}</dd>
                      </div>
                    </div>
                    <div className="mask-line">
                      <div data-exh-line className="flex gap-2">
                        <dt className="sr-only">Year</dt>
                        <dd>{art.year ?? `Year — ${TBC.toLowerCase()}`}</dd>
                      </div>
                    </div>
                  </dl>
                  <div className="mask-line mt-8 md:mt-12">
                    <div data-exh-line>
                      <Link
                        href={`/works/${art.slug}`}
                        className="t-label link-line inline-flex min-h-11 items-center text-ink"
                      >
                        View the work
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className="exh-frame z-0"
                  style={{ aspectRatio: `${art.image.src.width} / ${art.image.src.height}` }}
                >
                  <div
                    data-exh-inner
                    className="absolute inset-0"
                    style={{ transformOrigin: `${focus.x}% ${focus.y}%` }}
                  >
                    <Image
                      src={art.image.src}
                      alt={art.image.alt}
                      fill
                      quality={90}
                      placeholder="blur"
                      sizes="(orientation: portrait) 160svh, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href={`/works/${art.slug}`}
                    className="absolute inset-0 z-10"
                    data-cursor="View artwork"
                    tabIndex={-1}
                    aria-hidden
                  />
                </div>
              </div>

              <div className="exh-caption pointer-events-none invisible absolute bottom-[var(--gutter)] left-[var(--gutter)] z-20 items-center gap-4 bg-paper/92 px-4 py-3 opacity-0">
                <span className="t-num text-mute">{art.number}</span>
                <span className="t-label text-ink">
                  In detail — {art.category === "calligraphy" ? "canvas texture" : "the paint surface"}
                </span>
              </div>
            </article>
          );
        })}

        {/* Progress (pinned mode only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[calc(var(--header-h)+0.25rem)] right-[var(--gutter)] z-50 hidden items-center gap-4 text-ink mix-blend-difference lg:top-auto lg:bottom-[var(--gutter)] [html.js_&]:flex"
          style={{ color: "white" }}
        >
          <span className="t-num">
            <span data-exh-count>01</span> / {String(works.length).padStart(2, "0")}
          </span>
          <span className="relative block h-px w-20 bg-white/30">
            <span data-exh-progress className="absolute inset-0 origin-left scale-x-0 bg-white" />
          </span>
        </div>
      </div>
    </section>
  );
}
