"use client";

/**
 * Tiny store coordinating the opening sequence with the hero entrance.
 * The hero waits for `done` so both never animate at the same time.
 */
type Listener = () => void;

let done = false;
let playing = false;
const listeners = new Set<Listener>();

export const INTRO_KEY = "blerta:intro-seen";

export const introStore = {
  isDone: () => done,
  /** True when the opening sequence actually played on this page load. */
  didPlay: () => playing,
  markPlaying() {
    playing = true;
  },
  finish() {
    if (done) return;
    done = true;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    listeners.forEach((l) => l());
  },
  onDone(l: Listener) {
    if (done) {
      l();
      return () => {};
    }
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

/** Runs before paint (inline in <head>): marks JS + skips seen intros. */
export const preHydrationScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('${"blerta:intro-seen"}')||matchMedia('(prefers-reduced-motion: reduce)').matches||location.pathname!=='/'){d.dataset.intro='seen'}}catch(e){d.dataset.intro='seen'}})();`;
