import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Artwork } from "@/content/types";
import { displayTitle, TBC } from "@/content/artworks";
import { PlaceholderWall } from "@/components/ui/PlaceholderWall";

/**
 * A single work in a gallery. Real works link to their detail page and
 * morph into its hero image (View Transitions); placeholder slots render
 * as labelled empty walls and are not links.
 */
export function ArtworkTile({
  art,
  aspect,
  sizes,
  className = "",
  morph = true,
}: {
  art: Artwork;
  aspect?: string;
  sizes: string;
  className?: string;
  morph?: boolean;
}) {
  const ratio = aspect ?? (art.image ? `${art.image.src.width} / ${art.image.src.height}` : "4 / 3");

  const caption = (
    <div className="mt-4 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="t-num mb-2 text-mute">{art.number}</p>
        <h3 className="font-serif text-[1.65rem] leading-[1.05] tracking-[-0.01em] text-ink md:text-[2rem]">
          <span className="block overflow-hidden">
            <span className="block transition-transform duration-700 ease-[var(--ease-gallery)] group-hover:-translate-y-0.5">
              {displayTitle(art)}
            </span>
          </span>
        </h3>
      </div>
      <p className="t-label shrink-0 pt-1 text-right text-mute">
        {art.placeholder ? "Placeholder" : (art.year ?? TBC)}
      </p>
    </div>
  );

  if (art.placeholder || !art.image) {
    return (
      <div className={className}>
        <div className="relative" style={{ aspectRatio: ratio }}>
          <PlaceholderWall label="Artwork to come" note="Awaiting a photograph from Blerta’s portfolio" />
        </div>
        {caption}
      </div>
    );
  }

  const image = (
    <Image
      src={art.image.src}
      alt={art.image.alt}
      fill
      placeholder="blur"
      sizes={sizes}
      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-gallery)] group-hover:scale-[1.04]"
    />
  );

  return (
    <Link
      href={`/works/${art.slug}`}
      transitionTypes={["nav-forward"]}
      className={`group block ${className}`}
      data-cursor="View artwork"
    >
      <div className="relative overflow-hidden bg-ivory" style={{ aspectRatio: ratio }}>
        {morph ? (
          <ViewTransition name={`artwork-${art.slug}`} share="artwork-morph" default="none">
            <div className="absolute inset-0">{image}</div>
          </ViewTransition>
        ) : (
          image
        )}
        <span className="t-label pointer-events-none absolute bottom-4 left-4 translate-y-2 bg-paper/92 px-3 py-2 text-ink opacity-0 transition-all duration-500 ease-[var(--ease-gallery)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          View artwork
        </span>
      </div>
      {caption}
    </Link>
  );
}
