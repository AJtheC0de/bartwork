import Image from "next/image";
import { copy, social } from "@/content/site";
import { publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ArrowLink } from "@/components/ui/ArrowLink";

/**
 * CHAPTER 09 — SUPPORT THE ARTIST
 * A quiet invitation to explore, follow and get in touch.
 * Deliberately no donation or fundraising mechanics (see README).
 */
export function Support() {
  const art = publishedArtworks[0];
  return (
    <section aria-labelledby="support-title" className="gutter relative bg-ivory py-28 md:py-44">
      <div className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-28">
        <span className="t-num text-mute">08</span>
        <span className="t-label text-mute">Connect</span>
      </div>

      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <RevealText as="h2" id="support-title" className="t-h1 text-ink">
            {copy.support.headline[0]}
            <br />
            <em className="italic">{copy.support.headline[1]}</em>
          </RevealText>
          <Reveal delay={0.15} className="mt-10 max-w-[38ch] md:mt-14">
            <p className="t-lead text-ink/80">{copy.support.body}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 md:mt-16">
            <ArrowLink href="/works" variant="solid">
              Explore the artworks
            </ArrowLink>
            <ArrowLink href={social.instagram.url} external>
              Follow on Instagram
            </ArrowLink>
          </Reveal>
        </div>

        {art ? (
          <figure className="md:col-span-4 md:col-start-9 md:self-end">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Parallax amount={6} scale={1.14} className="absolute inset-0">
                <Image
                  src={art.image.src}
                  alt={art.image.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 767px) 100vw, 32vw"
                  className="object-cover"
                  style={{ objectPosition: "38% 50%" }}
                />
              </Parallax>
            </div>
            <figcaption className="mt-3 flex justify-between">
              <span className="t-label text-ink">Instagram</span>
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-num link-grow text-mute hover:text-ink"
              >
                {social.instagram.handle}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
