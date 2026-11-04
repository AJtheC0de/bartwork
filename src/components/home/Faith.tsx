"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { copy } from "@/content/site";
import { displayTitle, publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";

/**
 * CHAPTER 06 — FAITH
 * Visually quiet. The room darkens, a soft light finds the canvas, the
 * painting fades in whole. The calligraphy itself is never split,
 * distorted or animated — only the light and opacity around it change.
 */
export function Faith() {
  const root = useRef<HTMLElement>(null);
  const art = publishedArtworks.find((a) => a.category === "calligraphy");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The gallery dims as the visitor approaches.
        gsap.fromTo(
          root.current,
          { backgroundColor: "#f8f7f4" },
          {
            backgroundColor: "#17191a",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );
        gsap.fromTo(
          q("[data-faith-label]"),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 40%", end: "top 10%", scrub: true },
          },
        );
        // Painting: opacity and light only.
        gsap.fromTo(
          q("[data-faith-art]"),
          { autoAlpha: 0, filter: "brightness(0.55)" },
          {
            autoAlpha: 1,
            filter: "brightness(1)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-faith-art]")[0], start: "top 90%", end: "center 55%", scrub: true },
          },
        );
        gsap.fromTo(
          q("[data-faith-light]"),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-faith-art]")[0], start: "top 60%", end: "center 40%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="faith"
      aria-labelledby="faith-title"
      className="grain relative overflow-hidden bg-night text-paper"
    >
      <div className="gutter relative pt-36 pb-32 md:pt-56 md:pb-48">
        <div
          data-faith-label
          className="mb-20 flex items-baseline justify-between border-t border-white/15 pt-5 md:mb-32"
        >
          <span className="t-num text-white/45">05</span>
          <span className="t-label text-white/45">Faith</span>
        </div>

        {art ? (
          <figure className="relative mx-auto w-full max-w-[64rem]">
            {/* Soft gallery light from above */}
            <div
              data-faith-light
              aria-hidden
              className="pointer-events-none absolute -inset-x-[20%] -top-[45%] -bottom-[25%] bg-[radial-gradient(ellipse_50%_55%_at_50%_42%,rgb(255_246_232/0.11),transparent_70%)]"
            />
            <div data-faith-art className="relative shadow-[0_60px_120px_-50px_rgb(0_0_0/0.85)]">
              <Image
                src={(art.framedImage ?? art.image).src}
                alt={(art.framedImage ?? art.image).alt}
                quality={90}
                placeholder="blur"
                sizes="(max-width: 1100px) 92vw, 64rem"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-5 flex justify-between gap-4">
              <span className="t-label text-white/70">{displayTitle(art)}</span>
              <span className="t-num text-white/40">{art.number} / Selected work</span>
            </figcaption>
          </figure>
        ) : null}

        <div className="mx-auto mt-32 max-w-[64rem] md:mt-48">
          <RevealText
            as="h2"
            id="faith-title"
            duration={1.8}
            stagger={0.18}
            className="t-h2 text-center text-paper"
          >
            {copy.faith.headline[0]}
            <br />
            <em className="italic">{copy.faith.headline[1]}</em>
          </RevealText>

          <Reveal delay={0.4} className="mx-auto mt-12 flex max-w-[36ch] flex-col items-center gap-5 text-center">
            <p className="t-body text-white/70">{copy.faith.body.text}</p>
          </Reveal>
        </div>

        <blockquote className="mx-auto mt-40 max-w-[44rem] text-center md:mt-56">
          <span aria-hidden className="mx-auto mb-12 block h-16 w-px bg-white/25" />
          <RevealText
            as="p"
            duration={2}
            stagger={0.2}
            className="font-serif text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.08] tracking-[-0.015em] text-paper italic"
          >
            “{copy.faith.verse.text}”
          </RevealText>
          <Reveal delay={0.6} className="mt-10 flex flex-col items-center gap-5">
            <cite className="t-label text-white/55 not-italic">{copy.faith.reference}</cite>
          </Reveal>
        </blockquote>
      </div>
    </section>
  );
}
