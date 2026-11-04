import type { Metadata } from "next";
import { artworks } from "@/content/artworks";
import { social } from "@/content/site";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkTile } from "@/components/works/ArtworkTile";
import { ArrowLink } from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Selected works",
  description: "Abstract paintings and Islamic calligraphy by Blerta — a collection of expression, colour and meaning.",
  alternates: { canonical: "/works" },
};

/** Asymmetrical editorial placements, repeated as the collection grows. */
const PLACEMENT = [
  { cls: "md:col-span-7", aspect: undefined },
  { cls: "md:col-span-4 md:col-start-9 md:mt-[22vw]", aspect: undefined },
  { cls: "md:col-span-4 md:col-start-2 md:-mt-[6vw]", aspect: "4 / 5" },
  { cls: "md:col-span-5 md:col-start-7 md:mt-[10vw]", aspect: "3 / 4" },
];

export default function WorksPage() {
  return (
    <div className="gutter pt-[calc(var(--header-h)+18svh)] pb-10 md:pt-[calc(var(--header-h)+22svh)]">
      <header className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="t-label mb-8 text-mute">Collection — {String(artworks.length).padStart(2, "0")} entries</p>
          <RevealText as="h1" className="t-h1 text-ink" start="top 100%">
            Selected <em className="italic">works.</em>
          </RevealText>
        </div>
        <div className="flex items-end md:col-span-4">
          <RevealText as="p" delay={0.15} start="top 100%" className="t-lead text-ink/70">
            A collection of expression, colour and meaning.
          </RevealText>
        </div>
      </header>

      <div className="mt-20 grid gap-y-20 border-t border-line pt-10 md:mt-32 md:grid-cols-12 md:gap-x-8 md:gap-y-28 md:pt-16">
        {artworks.map((art, i) => {
          const p = PLACEMENT[i % PLACEMENT.length];
          return (
            <Reveal key={art.slug} className={p.cls} y={40} start="top 95%">
              <ArtworkTile art={art} aspect={p.aspect} sizes="(max-width: 767px) 100vw, 58vw" />
            </Reveal>
          );
        })}
      </div>

      <div className="mt-32 flex flex-col items-start gap-6 border-t border-line pt-10 md:mt-48 md:flex-row md:items-center md:justify-between">
        <p className="t-lead max-w-[30ch] text-ink">
          More of Blerta’s work appears first on Instagram.
        </p>
        <ArrowLink href={social.instagram.url} external>
          Follow {social.instagram.handle}
        </ArrowLink>
      </div>
    </div>
  );
}
