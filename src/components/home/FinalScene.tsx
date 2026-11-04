"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { copy, social } from "@/content/site";
import { publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowLink } from "@/components/ui/ArrowLink";

/**
 * CHAPTER 11 — THE FINAL SCENE
 * Two lines, then a painting slowly opens from a narrow slit to its full
 * width — a last look before the footer.
 */
export function FinalScene() {
  const root = useRef<HTMLElement>(null);
  const art = publishedArtworks[0];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-final-mask]"),
          { clipPath: "inset(0% 44% 0% 44%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-final-mask]")[0], start: "top 95%", end: "center 55%", scrub: true },
          },
        );
        gsap.fromTo(
          q("[data-final-img]"),
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-final-mask]")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Closing" className="gutter relative bg-paper pt-36 md:pt-56">
      <div className="mx-auto max-w-[70rem] text-center">
        <RevealText as="p" className="t-h2 text-ink">
          {copy.final.lines[0]}
        </RevealText>
        <RevealText as="p" delay={0.25} className="t-h2 mt-2 text-ink/45 italic">
          {copy.final.lines[1]}
        </RevealText>
      </div>

      {art ? (
        <div className="mt-24 md:mt-36">
          <div
            data-final-mask
            className="relative mx-auto aspect-[4/5] w-full overflow-hidden md:aspect-[21/9]"
          >
            <div data-final-img className="absolute inset-0">
              <Image
                src={art.image.src}
                alt={art.image.alt}
                fill
                placeholder="blur"
                quality={90}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: "50% 62%" }}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 md:mt-20">
        <ArrowLink href={social.instagram.url} external>
          Follow the story on Instagram
        </ArrowLink>
        <ArrowLink href="/contact">Get in touch</ArrowLink>
      </div>
    </section>
  );
}
