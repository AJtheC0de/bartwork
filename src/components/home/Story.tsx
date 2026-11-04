"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { copy, photos } from "@/content/site";
import type { Photo } from "@/content/types";
import { publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { ApprovalNote } from "@/components/ui/ApprovalNote";
import { PlaceholderWall } from "@/components/ui/PlaceholderWall";
import { Crop } from "@/components/ui/Crop";

function PhotoFrame({
  photo,
  aspect,
  sizes,
  fig,
}: {
  photo: Photo;
  aspect: string;
  sizes: string;
  fig: string;
}) {
  return (
    <figure>
      <div data-story-mask className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
        <div data-story-inner className="absolute inset-0">
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              placeholder="blur"
              sizes={sizes}
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          ) : (
            <PlaceholderWall label="Photograph to come" note={photo.alt} />
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="t-label text-ink">{photo.caption}</span>
        <span className="t-num text-mute">{fig}</span>
      </figcaption>
    </figure>
  );
}

/**
 * CHAPTER 07 — THE STORY BEHIND THE ART
 * An intimate visual journal: large and small documentary photographs at
 * different depths, and space reserved for Blerta's own words.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);
  // Real photographs first; any gap is filled with a real painting rather
  // than an empty wall.
  const real = photos.story.filter((p) => p.src);
  const artFill: Photo[] = publishedArtworks
    .slice()
    .reverse()
    .map((art) => ({
      src: (art.framedImage ?? art.image).src,
      alt: (art.framedImage ?? art.image).alt,
      caption: "From the collection",
    }));
  const [a, b, c, d] = [...real, ...artFill];
  const personal = copy.story.personal;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Light returns after the Faith chapter.
        gsap.fromTo(
          root.current,
          { backgroundColor: "#17191a" },
          {
            backgroundColor: "#f8f7f4",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 35%", scrub: true },
          },
        );
        q<HTMLElement>("[data-story-mask]").forEach((m) => {
          gsap.fromTo(
            m,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.inOut",
              scrollTrigger: { trigger: m, start: "top 85%", once: true },
            },
          );
        });
        // Documentary photos drift at different depths.
        q<HTMLElement>("[data-depth]").forEach((el) => {
          const depth = Number(el.dataset.depth);
          gsap.fromTo(
            el,
            { y: depth * 60 },
            {
              y: -depth * 60,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        // Film strip: a scroll-driven sequence of moments.
        const strip = q("[data-strip]")[0] as HTMLElement | undefined;
        if (strip) {
          gsap.fromTo(
            strip,
            { x: () => window.innerWidth * 0.1 },
            {
              x: () => -(strip.scrollWidth - window.innerWidth * 0.9),
              ease: "none",
              scrollTrigger: {
                trigger: strip.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Film strip: approved photographs first, then real details of the paintings.
  type StripItem =
    | { kind: "photo"; key: string; photo: Photo }
    | { kind: "detail"; key: string; art: (typeof publishedArtworks)[number]; i: number };
  const strip: StripItem[] = [
    ...photos.story.filter((p) => p.src).map((photo, i) => ({ kind: "photo" as const, key: `p${i}`, photo })),
    ...publishedArtworks.flatMap((art) =>
      (art.details ?? []).map((_, i) => ({ kind: "detail" as const, key: `${art.slug}-${i}`, art, i })),
    ),
  ];

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="relative bg-paper">
      <div className="gutter pt-36 md:pt-52">
        <div className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-28">
          <span className="t-num text-mute">06</span>
          <span className="t-label text-mute">The story</span>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <RevealText as="h2" id="story-title" className="t-h1 text-ink md:col-span-10">
            More than a <em className="italic">canvas.</em>
          </RevealText>
          <RevealText as="p" delay={0.2} className="t-lead text-ink/70 italic md:col-span-5 md:col-start-8 md:mt-6">
            {copy.story.sub}
          </RevealText>
        </div>

        {/* Row A — large image + her words */}
        <div className="mt-20 grid gap-14 md:mt-32 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <PhotoFrame photo={a} aspect="4 / 5" sizes="(max-width: 767px) 100vw, 56vw" fig="Fig. 02" />
          </div>
          <div className="flex flex-col justify-end md:col-span-4 md:col-start-9 md:pb-16">
            <span className="t-num mb-6 text-mute">(In her words)</span>
            {personal.length ? (
              personal.map((para, i) => (
                <RevealText key={i} as="p" className="t-lead mb-6 text-ink">
                  {para}
                </RevealText>
              ))
            ) : (
              <Reveal>
                <p className="t-lead text-ink/45 italic">{copy.story.personalPlaceholder}</p>
                <ApprovalNote className="mt-6" label="Awaiting Blerta’s personal story" />
              </Reveal>
            )}
          </div>
        </div>

        {/* Row B — documentary photographs at different depths */}
        <div className="mt-28 grid grid-cols-12 gap-4 md:mt-44 md:gap-8">
          <div data-depth="0.6" className="col-span-7 md:col-span-4 md:col-start-2">
            <PhotoFrame photo={b} aspect="3 / 4" sizes="(max-width: 767px) 60vw, 30vw" fig="Fig. 03" />
          </div>
          <div data-depth="-0.4" className="col-span-8 col-start-5 mt-16 md:col-span-5 md:col-start-7 md:mt-48">
            <PhotoFrame photo={c} aspect="4 / 3" sizes="(max-width: 767px) 70vw, 40vw" fig="Fig. 04" />
          </div>
        </div>

        {/* Row C — wide (only once a real photograph exists) */}
        {d?.src ? (
          <div className="mt-24 md:mt-40 md:pl-[16.66%]">
            <PhotoFrame photo={d} aspect="16 / 9" sizes="(max-width: 767px) 100vw, 80vw" fig="Fig. 05" />
          </div>
        ) : null}
      </div>

      {/* Film strip */}
      <div className="relative mt-28 md:mt-44">
        <div className="gutter mb-6 flex items-baseline justify-between">
          <span className="t-label text-ink">From the studio wall</span>
          <span className="t-num text-mute">Details, in sequence</span>
        </div>
        <div
          className="overflow-x-auto pb-6 motion-safe:overflow-hidden"
          aria-label="Details of Blerta’s paintings"
          role="group"
        >
          <ul data-strip className="flex w-max gap-4 pl-[var(--gutter)] md:gap-6">
            {strip.map((item) => (
              <li key={item.key} className="w-[46vw] shrink-0 md:w-[19vw]">
                {item.kind === "photo" && item.photo.src ? (
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.photo.src}
                      alt={item.photo.alt}
                      fill
                      sizes="(max-width: 767px) 46vw, 19vw"
                      className="object-cover"
                    />
                  </div>
                ) : item.kind === "detail" ? (
                  <Crop
                    src={item.art.image.src}
                    alt={`Detail — ${item.art.details![item.i].label.toLowerCase()}.`}
                    focus={item.art.details![item.i].focus}
                    zoom={item.art.details![item.i].zoom}
                    aspect={3 / 4}
                    boxVw={20}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
