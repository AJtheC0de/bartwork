import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import {
  availabilityLabel,
  displayTitle,
  getArtwork,
  publishedArtworks,
  TBC,
} from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Crop } from "@/components/ui/Crop";
import { ApprovalNote } from "@/components/ui/ApprovalNote";

export function generateStaticParams() {
  return publishedArtworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) return {};
  const title = displayTitle(art);
  return {
    title,
    description: art.description ?? art.draftDescription ?? `${title} — an artwork by Blerta.`,
    alternates: { canonical: `/works/${art.slug}` },
    openGraph: {
      title: `${title} — Blerta`,
      images: [{ url: art.image.src.src, width: art.image.src.width, height: art.image.src.height, alt: art.image.alt }],
    },
  };
}

export default async function ArtworkPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) notFound();

  const title = displayTitle(art);
  const index = publishedArtworks.findIndex((a) => a.slug === art.slug);
  const next = publishedArtworks[(index + 1) % publishedArtworks.length];
  const facts: [string, string][] = [
    ["Medium", art.medium ?? TBC],
    ["Dimensions", art.dimensions ?? TBC],
    ["Year", art.year ?? TBC],
    ["Availability", art.availability ? availabilityLabel[art.availability] : TBC],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: title,
    creator: { "@type": "Person", name: "Blerta" },
    image: art.image.src.src,
    ...(art.medium ? { artMedium: art.medium } : {}),
    ...(art.year ? { dateCreated: art.year } : {}),
  };

  return (
    <article className="pt-[calc(var(--header-h)+6svh)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="gutter flex items-center justify-between py-6">
        <Link href="/works" transitionTypes={["nav-back"]} className="t-label link-grow text-ink">
          ← All works
        </Link>
        <span className="t-num text-mute">{art.number} / {String(publishedArtworks.length).padStart(2, "0")}</span>
      </div>

      {/* Hero image — morphs from the gallery tile */}
      <div className="gutter">
        <div
          className="relative mx-auto max-h-[78svh] w-full bg-ivory"
          style={{
            aspectRatio: `${art.image.src.width} / ${art.image.src.height}`,
            maxWidth: `calc(78svh * ${art.image.src.width / art.image.src.height})`,
          }}
        >
          <ViewTransition name={`artwork-${art.slug}`} share="artwork-morph" default="none">
            <div className="absolute inset-0">
              <Image
                src={art.image.src}
                alt={art.image.alt}
                fill
                preload
                quality={90}
                placeholder="blur"
                sizes="(max-width: 767px) 100vw, 90vw"
                className="object-cover"
              />
            </div>
          </ViewTransition>
        </div>
      </div>

      <div className="gutter mt-16 grid gap-14 md:mt-28 md:grid-cols-12 md:gap-8">
        <header className="md:col-span-6">
          <p className="t-num mb-6 text-mute">{art.number} / Selected work</p>
          <RevealText as="h1" className="t-h2 text-ink" start="top 100%">
            {title}
          </RevealText>
          {!art.title ? (
            <Reveal className="mt-6">
              <ApprovalNote label="Working title — awaiting confirmation" />
            </Reveal>
          ) : null}
        </header>

        <div className="md:col-span-5 md:col-start-8">
          <dl className="border-t border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-line py-4">
                <dt className="t-label pt-0.5 text-mute">{k}</dt>
                <dd className={`t-body ${v === TBC ? "text-mute italic" : "text-ink"}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            {art.description ? (
              <p className="t-body max-w-[52ch] text-ink/85">{art.description}</p>
            ) : (
              <>
                <p className="t-body max-w-[52ch] text-ink/70">{art.draftDescription}</p>
                <ApprovalNote className="mt-4" label="Visual description — awaiting Blerta’s own text" />
              </>
            )}
          </div>

          <div className="mt-12">
            <ArrowLink href={`/contact?artwork=${art.slug}`} variant="solid">
              Enquire about this work
            </ArrowLink>
          </div>
        </div>
      </div>

      {art.details?.length ? (
        <section aria-labelledby="details-heading" className="gutter mt-32 md:mt-48">
          <div className="mb-10 flex items-baseline justify-between border-t border-line pt-5 md:mb-16">
            <h2 id="details-heading" className="t-label text-ink">In detail</h2>
            <span className="t-num text-mute">Magnified from the original photograph</span>
          </div>
          <ul className="grid gap-10 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {art.details.map((d, i) => (
              <li key={d.label} className={i % 2 ? "lg:mt-24" : ""}>
                <Reveal y={30}>
                  <Crop
                    src={art.image.src}
                    alt={`Magnified detail — ${d.label.toLowerCase()} — from ${title}.`}
                    focus={d.focus}
                    zoom={d.zoom}
                    aspect={4 / 5}
                    boxVw={25}
                  />
                  <p className="mt-3 flex justify-between">
                    <span className="t-label text-ink">{d.label}</span>
                    <span className="t-num text-mute">D.{String(i + 1).padStart(2, "0")}</span>
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {next && next.slug !== art.slug ? (
        <nav aria-label="Next artwork" className="gutter mt-32 md:mt-48">
          <Link
            href={`/works/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="group grid items-end gap-8 border-t border-line pt-8 md:grid-cols-12"
            data-cursor="Next work"
          >
            <div className="md:col-span-6">
              <p className="t-label mb-4 text-mute">Next work</p>
              <p className="t-h2 text-ink transition-transform duration-700 ease-[var(--ease-gallery)] group-hover:translate-x-3">
                {displayTitle(next)}
              </p>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden md:col-span-4 md:col-start-9">
              <Image
                src={next.image.src}
                alt=""
                fill
                placeholder="blur"
                sizes="(max-width: 767px) 100vw, 30vw"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-gallery)] group-hover:scale-105"
              />
            </div>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
