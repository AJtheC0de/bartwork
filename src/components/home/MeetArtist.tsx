"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { copy, photos } from "@/content/site";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { PlaceholderWall } from "@/components/ui/PlaceholderWall";

/**
 * CHAPTER 03 — MEET BLERTA
 * Split editorial layout. Portrait reveals through a vertical mask with a
 * gentle inner parallax; text arrives line by line.
 */
export function MeetArtist() {
  const root = useRef<HTMLElement>(null);
  const portrait = photos.portrait;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-portrait-mask]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "expo.inOut",
            scrollTrigger: { trigger: q("[data-portrait-mask]")[0], start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          q("[data-portrait-inner]"),
          { yPercent: -6, scale: 1.14 },
          {
            yPercent: 6,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-portrait-mask]")[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        // Text column drifts a touch slower than the page for depth.
        gsap.fromTo(
          q("[data-meet-col]"),
          { y: 60 },
          {
            y: -60,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
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
      id="artist"
      aria-labelledby="meet-title"
      className="gutter relative bg-paper py-28 md:py-40 lg:py-52"
    >
      <div className="mb-14 flex items-baseline justify-between border-t border-line pt-5 md:mb-24">
        <span className="t-num text-mute">02</span>
        <span className="t-label text-mute">The artist</span>
      </div>

      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        <figure className="md:col-span-5 lg:col-span-5">
          <div data-portrait-mask className="relative aspect-[4/5] overflow-hidden">
            <div data-portrait-inner className="absolute inset-0">
              {portrait.src ? (
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 767px) 100vw, 42vw"
                  className="object-cover"
                  style={{ objectPosition: portrait.position }}
                />
              ) : (
                <PlaceholderWall label="Portrait to come" />
              )}
            </div>
          </div>
          <figcaption className="mt-4 flex justify-between gap-4">
            <span className="t-label text-ink">{portrait.caption}</span>
            <span className="t-num text-mute">Fig. 01</span>
          </figcaption>
        </figure>

        <div data-meet-col className="flex flex-col justify-center md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <RevealText as="h2" id="meet-title" className="t-h2 text-ink">
            {copy.meet.headline}
          </RevealText>
          <RevealText as="p" delay={0.15} className="t-lead mt-6 max-w-[24ch] text-ink/75 italic md:mt-8">
            {copy.meet.sub}
          </RevealText>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[auto_1fr] md:gap-10">
            <span className="t-num pt-1.5 text-mute">(Bio)</span>
            <div>
              <RevealText as="p" delay={0.1} stagger={0.06} duration={1.1} className="t-body max-w-[46ch] text-ink/85">
                {copy.meet.bio.text}
              </RevealText>
              <Reveal delay={0.3} className="mt-12">
                <ArrowLink href="#story">Discover her story</ArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
