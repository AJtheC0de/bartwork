"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { artworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { ArtworkTile } from "@/components/works/ArtworkTile";
import { ArrowLink } from "@/components/ui/ArrowLink";

/** How many works the home-page wall shows; /works has the full collection. */
const HOME_COUNT = 8;

/** Height + vertical offset rhythm for the horizontal sequence. */
const RHYTHM = [
  { w: "hz:w-[46vw]", offset: "hz:self-end", aspect: undefined },
  { w: "hz:w-[34vw]", offset: "hz:self-start", aspect: undefined },
  { w: "hz:w-[24vw]", offset: "hz:self-center", aspect: "3 / 4" },
  { w: "hz:w-[30vw]", offset: "hz:self-end", aspect: "4 / 5" },
];

/**
 * CHAPTER 08 — SELECTED WORKS (home)
 * Desktop: one horizontal exhibition wall, moved by vertical scrolling.
 * Mobile / reduced motion: a natural single-column gallery.
 */
export function SelectedWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0] as HTMLElement;
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Each work drifts very slightly against the wall for depth.
        q<HTMLElement>("[data-work]").forEach((w, i) => {
          gsap.fromTo(
            w,
            { yPercent: i % 2 ? -4 : 4 },
            {
              yPercent: i % 2 ? 4 : -4,
              ease: "none",
              scrollTrigger: {
                trigger: q("[data-pin]")[0],
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="works" aria-labelledby="works-title" className="relative bg-paper">
      <div data-pin className="relative hz:flex hz:h-[100svh] hz:items-center hz:overflow-hidden">
        <div
          data-track
          className="gutter flex flex-col gap-20 py-28 hz:h-full hz:w-max hz:flex-row hz:items-stretch hz:gap-[6vw] hz:py-[calc(var(--header-h)+4svh)] hz:pr-[10vw]"
        >
          <header className="flex flex-col justify-between hz:w-[30vw] hz:shrink-0 hz:py-4">
            <div className="flex items-baseline justify-between border-t border-line pt-5">
              <span className="t-num text-mute">07</span>
              <span className="t-label text-mute">Collection</span>
            </div>
            <div className="mt-14 hz:mt-0">
              <RevealText as="h2" id="works-title" className="t-h1 text-ink">
                Selected <em className="italic">works.</em>
              </RevealText>
              <RevealText as="p" delay={0.15} className="t-lead mt-6 max-w-[22ch] text-ink/70">
                A collection of expression, colour and meaning.
              </RevealText>
            </div>
            <div className="mt-10 hz:mt-0">
              <ArrowLink href="/works">View all works</ArrowLink>
            </div>
          </header>

          {artworks.slice(0, HOME_COUNT).map((art, i) => {
            const r = RHYTHM[i % RHYTHM.length];
            return (
              <div
                key={art.slug}
                data-work
                className={`w-full shrink-0 ${r.w} ${r.offset} ${i % 2 ? "pl-[12%] lg:ml-auto lg:w-[58%] lg:pl-0 hz:ml-0 hz:pl-0" : "pr-[6%] lg:w-[64%] lg:pr-0 hz:pr-0"}`}
              >
                <ArtworkTile art={art} aspect={r.aspect} sizes="(max-width: 1023px) 94vw, 64vw" />
              </div>
            );
          })}

          <div className="flex items-center hz:w-[22vw] hz:shrink-0">
            <div>
              <p className="t-num mb-4 text-mute">More to come</p>
              <p className="t-lead max-w-[18ch] text-ink">
                The collection grows as Blerta continues to paint.
              </p>
              <div className="mt-8">
                <ArrowLink href="/works">The full collection</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
