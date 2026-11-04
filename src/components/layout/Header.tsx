"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { navigation, social } from "@/content/site";
import { useLenis } from "@/components/motion/SmoothScroll";

const EASE = [0.76, 0, 0.24, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Freeze page scroll while the overlay is open.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  // Links close the menu via `onNavigate`; this also closes it if the
  // page is hidden by Activity while open.
  useLayoutEffect(() => () => setOpen(false), []);

  // Keyboard: Escape closes, Tab is kept inside the overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="t-label fixed top-3 left-3 z-[80] -translate-y-24 bg-ink px-4 py-3 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="gutter flex h-[var(--header-h)] items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto font-serif text-[1.65rem] leading-none tracking-[-0.02em]"
            aria-label="Blerta — home"
          >
            Blerta
          </Link>

          <nav aria-label="Primary" className="t-label pointer-events-auto hidden items-center gap-9 md:flex">
            <Link href="/works" className="link-grow">
              Works
            </Link>
            <Link href="/contact" className="link-grow">
              Contact
            </Link>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="t-label pointer-events-auto -mr-3 flex min-h-12 items-center gap-3 px-3"
          >
            <span>Menu</span>
            <span aria-hidden className="flex w-6 flex-col gap-[5px]">
              <span className="block h-px w-full bg-current" />
              <span className="block h-px w-2/3 self-end bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="grain fixed inset-0 z-[70] flex flex-col bg-night text-paper"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
            onAnimationComplete={() => {
              panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
            }}
          >
            <div className="gutter flex h-[var(--header-h)] shrink-0 items-center justify-between">
              <span className="font-serif text-[1.65rem] leading-none">Blerta</span>
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  close();
                  buttonRef.current?.focus();
                }}
                className="t-label -mr-3 flex min-h-12 items-center gap-3 px-3"
              >
                Close
                <span aria-hidden className="relative block size-4">
                  <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                  <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <nav
              aria-label="Menu"
              className="gutter flex flex-1 flex-col justify-center overflow-y-auto py-10"
              data-lenis-prevent
            >
              <ul className="flex flex-col gap-1 md:gap-0">
                {navigation.map((item, i) => (
                  <li key={item.href} className="mask-line">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-110%", transition: { duration: 0.5, ease: EASE } }}
                      transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.35 + i * 0.07 }}
                    >
                      <Link
                        href={item.href}
                        onNavigate={close}
                        className="group flex items-baseline gap-5 py-1 md:gap-8"
                      >
                        <span className="t-num w-6 text-white/40">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-serif text-[clamp(3rem,9.5vw,8.5rem)] leading-[0.98] tracking-[-0.03em] transition-[color,transform] duration-700 ease-[var(--ease-gallery)] group-hover:translate-x-3 group-hover:text-sand md:leading-[0.94]">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="gutter flex shrink-0 flex-wrap items-end justify-between gap-4 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label link-grow"
              >
                Instagram {social.instagram.handle}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="t-label text-white/40">Artist & Creator</span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
