import Link from "next/link";
import { agency, site, social } from "@/content/site";

export function Footer() {
  return (
    <footer className="gutter relative pt-24 pb-8 md:pt-32">
      <div className="border-t border-line pt-10">
        <p
          className="-ml-[0.02em] font-serif text-[36.2vw] leading-[0.78] tracking-[-0.035em] text-ink select-none"
          aria-label={site.name}
        >
          {site.name.toUpperCase()}
        </p>
        <div className="mt-6 grid gap-10 md:mt-10 md:grid-cols-12 md:items-end">
          <p className="t-label text-mute md:col-span-3">{site.role}</p>

          <nav aria-label="Footer" className="md:col-span-5">
            <ul className="t-label flex flex-wrap gap-x-8 gap-y-4">
              <li>
                <Link href="/" className="link-grow">Home</Link>
              </li>
              <li>
                <Link href="/works" className="link-grow">Works</Link>
              </li>
              <li>
                <Link href="/contact" className="link-grow">Contact</Link>
              </li>
              <li>
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-grow"
                >
                  Instagram<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/privacy" className="link-grow text-mute">Privacy</Link>
              </li>
            </ul>
          </nav>

          <p className="t-num text-mute md:col-span-4 md:text-right">
            A website gifted with care by{" "}
            <a
              href={agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-ink/70 hover:text-ink"
            >
              {agency.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
