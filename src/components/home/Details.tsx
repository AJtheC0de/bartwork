"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { displayTitle, publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Crop } from "@/components/ui/Crop";

/** Editorial rhythm for the macro panels (desktop column placement). */
const LAYOUT = [
  { aspect: 4 / 5, cls: "md:w-full" },
  { aspect: 1, cls: "md:ml-auto md:w-[68%]" },
  { aspect: 3 / 2, cls: "md:w-[88%]" },
  { aspect: 4 / 5, cls: "md:ml-[22%] md:w-[62%]" },
  { aspect: 16 / 10, cls: "md:w-full" },
];

const ORDER: [string, string][] = [
  ["long-way-home", "Brushwork"],
  ["long-way-home", "Texture"],
  ["and-he-is", "Calligraphic form"],
  ["colors-of-hope", "Splatter"],
  ["and-he-is", "Ground texture"],
];

/**
 * CHAPTER 05 — THE BEAUTY OF DETAILS
 * Like leaning in close to a canvas: magnified regions of the real
 * photographs open through clipping masks while the view drifts slowly
 * across the paint surface.
 */
export function Details() {
  const root = useRef<HTMLElement>(null);

  const panels = ORDER.flatMap(([slug, label]) => {
    const art = publishedArtworks.find((a) => a.slug === slug);
    const detail = art?.details?.find((d) => d.label === label);
    return art && detail ? [{ art, detail }] : [];
  });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q<HTMLElement>("[data-detail]").forEach((panel, i) => {
          const mask = panel.querySelector("[data-detail-mask]");
          const inner = panel.querySelector("[data-detail-inner]");
          gsap.fromTo(
            mask,
            { clipPath: "inset(14% 10% 14% 10%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "top 35%", scrub: true },
            },
          );
          // Slow drift across the surface + gentle settle in scale.
          gsap.fromTo(
            inner,
            { scale: 1.32, xPercent: i % 2 ? 4 : -4, yPercent: 5 },
            {
              scale: 1.04,
              xPercent: i % 2 ? -4 : 4,
              yPercent: -5,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  if (!panels.length) return null;

  return (
    <section
      ref={root}
      id="details"
      aria-labelledby="details-title"
      className="gutter relative bg-paper py-28 md:py-40"
    >
      <div className="mb-14 flex items-baseline justify-between border-t border-line pt-5 md:mb-24">
        <span className="t-num text-mute">04</span>
        <span className="t-label text-mute">Up close</span>
      </div>

      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[28svh]">
            <RevealText as="h2" id="details-title" className="t-h2 max-w-[9ch] text-ink">
              Every detail tells a story.
            </RevealText>
            <p className="t-body mt-8 max-w-[34ch] text-mute">
              Ridges of paint, layered colour, the movement of a hand. Scroll slowly — these are
              magnified views of the original canvases.
            </p>
          </div>
        </div>

        <ol className="flex flex-col gap-20 md:col-span-6 md:col-start-7 md:gap-32">
          {panels.map(({ art, detail }, i) => {
            const layout = LAYOUT[i % LAYOUT.length];
            return (
              <li
                key={`${art.slug}-${detail.label}`}
                data-detail
                className={`${i % 2 ? "ml-auto w-[86%]" : "w-[92%]"} ${layout.cls}`}
              >
                <figure>
                  <div data-detail-mask>
                    <Crop
                      src={art.image.src}
                      alt={`Magnified detail — ${detail.label.toLowerCase()} — from ${displayTitle(art)}.`}
                      focus={detail.focus}
                      zoom={detail.zoom}
                      aspect={layout.aspect}
                      boxVw={45}
                      innerProps={{ "data-detail-inner": "" }}
                    />
                  </div>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-6">
                    <span className="t-label text-ink">{detail.label}</span>
                    <span className="t-num text-right text-mute">
                      D.{String(i + 1).padStart(2, "0")} — from “{displayTitle(art)}”
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
