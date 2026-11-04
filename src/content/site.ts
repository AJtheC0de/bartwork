import type { ApprovableText, Photo } from "./types";
import blertaStudio from "./images/blerta-studio.png";
import presentation from "./images/presentation.png";

/**
 * SITE CONTENT
 * ------------
 * Every piece of personal copy is an `ApprovableText`. While `approved` is
 * `false` the site renders a small "Awaiting Blerta's approval" marker next
 * to it. Flip to `true` only after Blerta has read and agreed to the wording.
 */

export const site = {
  name: "Blerta",
  role: "Artist & Creator",
  title: "Blerta — Art Beyond Words",
  description:
    "The work of Blerta, a visual artist creating expressive abstract paintings and Islamic calligraphy. A world of colour, creativity and faith.",
  /** Set NEXT_PUBLIC_SITE_URL in production (used for canonical/OG/sitemap). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_GB",
};

export const social = {
  instagram: {
    handle: "@blerta_a",
    url: "https://www.instagram.com/blerta_a/",
  },
};

export const agency = {
  name: "SIXAM",
  url: "https://ajnuni.me/",
};

export const copy = {
  hero: {
    label: "Blerta — Visual artist",
    headline: ["Art beyond", "words."],
    sub: "A world of colour, creativity and faith.",
  },
  meet: {
    headline: "Meet the artist.",
    sub: "A story told through colour, creativity and faith.",
    bio: {
      text: "Blerta is a visual artist whose work explores colour, expression and meaning. Through abstract painting and calligraphy, she creates pieces that reflect her artistic perspective and the values close to her heart.",
      approved: false,
    } satisfies ApprovableText,
  },
  faith: {
    headline: ["Faith, through", "every chapter."],
    body: {
      text: "Through life's challenges, faith remains an important part of Blerta's journey.",
      approved: false,
    } satisfies ApprovableText,
    /**
     * Qur'an 57:4 (Surat al-Hadid), excerpt — rendering as in the Sahih
     * International translation. Confirm it matches the wording Blerta uses
     * in her Instagram biography before approving.
     */
    verse: {
      text: "And He is with you wherever you are.",
      approved: false,
    } satisfies ApprovableText,
    reference: "Qur’an 57:4 — excerpt",
  },
  story: {
    headline: "More than a canvas.",
    sub: "The person behind every creation.",
    /**
     * Blerta's own words go here. Do not write this on her behalf.
     * Each entry becomes one paragraph beside the photographs.
     */
    personal: [] as string[],
    personalPlaceholder:
      "This space is reserved for Blerta’s own words — about her practice, what moves her to paint, and, only if she chooses, how her health shapes the way she works.",
  },
  support: {
    headline: ["Let art find", "its place."],
    body: "Discover Blerta’s work, follow her creative journey or get in touch about a piece that speaks to you.",
  },
  contact: {
    headline: ["Let’s connect", "through art."],
    body: "For artwork enquiries, collaborations or simply to say hello.",
  },
  final: {
    lines: ["Art is a part of her story.", "And the story continues."],
  },
};

/**
 * Personal photographs for "Meet the artist" and "More than a canvas".
 * `src: null` renders a labelled placeholder. Add photos to
 * `src/content/images/` and import them here once Blerta has approved them.
 */
export const photos: { portrait: Photo; story: Photo[] } = {
  portrait: {
    src: blertaStudio,
    alt: "Blerta standing beside one of her paintings on a wooden easel.",
    caption: "Blerta in the studio",
    position: "14% 35%",
  },
  story: [
    {
      src: presentation,
      alt: "Blerta's calligraphy painting of the name of Allah, presented on a stand in a prayer room.",
      caption: "Presenting the calligraphy",
      position: "66% 60%",
    },
    {
      src: blertaStudio,
      alt: "Blerta standing beside her red painting with a black double-headed eagle.",
      caption: "Beside a finished canvas",
      position: "30% 40%",
    },
    // Add further approved photographs here (e.g. Blerta at work).
    { src: null, alt: "Blerta working on a painting", caption: "At work in the studio" },
    { src: null, alt: "A moment from Blerta's creative journey", caption: "Moments from the journey" },
  ],
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "The artist", href: "/#artist" },
  { label: "Faith", href: "/#faith" },
  { label: "Contact", href: "/contact" },
];
