import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { copy, social } from "@/content/site";
import { publishedArtworks } from "@/content/artworks";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "For artwork enquiries, collaborations or simply to say hello to Blerta.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const art = publishedArtworks.find((a) => a.category === "calligraphy") ?? publishedArtworks[0];
  return (
    <div className="gutter pt-[calc(var(--header-h)+16svh)] md:pt-[calc(var(--header-h)+20svh)]">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="t-label mb-8 text-mute">Contact</p>
          <RevealText as="h1" className="t-h1 text-ink" start="top 100%">
            {copy.contact.headline[0]}
            <br />
            <em className="italic">{copy.contact.headline[1]}</em>
          </RevealText>
          <Reveal delay={0.2} className="mt-8 max-w-[34ch]">
            <p className="t-lead text-ink/75">{copy.contact.body}</p>
          </Reveal>

          <Reveal delay={0.3} className="mt-16 max-w-[40rem] md:mt-24">
            <Suspense fallback={<div className="h-[34rem]" aria-hidden />}>
              <ContactForm />
            </Suspense>
          </Reveal>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          {art ? (
            <figure className="md:sticky md:top-[calc(var(--header-h)+4rem)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-night">
                <Parallax amount={5} scale={1.12} className="absolute inset-0">
                  <Image
                    src={art.image.src}
                    alt={art.image.alt}
                    fill
                    placeholder="blur"
                    sizes="(max-width: 767px) 100vw, 32vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              <figcaption className="mt-8 grid gap-6 border-t border-line pt-6">
                <div>
                  <p className="t-label mb-2 text-mute">Instagram</p>
                  <a
                    href={social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-lead link-grow text-ink"
                  >
                    {social.instagram.handle}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
                <p className="t-num text-mute">
                  For artwork enquiries, mention the work you’re interested in.
                </p>
              </figcaption>
            </figure>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
