import type { Artwork } from "./types";

import abstractImpasto from "./images/abstract-impasto.png";
import abstractImpastoFramed from "./images/abstract-impasto-framed.png";
import allahCalligraphy from "./images/allah-calligraphy.png";
import allahCalligraphyFramed from "./images/allah-calligraphy-framed.png";
import eagle from "./images/eagle.png";
import eagleFramed from "./images/eagle-framed.png";

/**
 * ARTWORKS
 * --------
 * The single source of truth for every artwork on the site.
 * Order in this array = order in galleries.
 *
 * Rules (see README → "Content rules"):
 *  - Never invent titles, dimensions, years, prices or availability.
 *    Use `null` until Blerta confirms a value; the UI shows "To be confirmed".
 *  - `placeholder: true` marks an empty slot. It is shown as a labelled
 *    empty gallery wall and never presented as a real work.
 */
export const artworks: Artwork[] = [
  {
    slug: "abstract-composition",
    number: "01",
    title: null,
    workingTitle: "Untitled (abstract)",
    medium: null,
    dimensions: null,
    year: null,
    availability: null,
    description: null,
    draftDescription:
      "A large abstract composition of soft blue, lilac, peach and cream, built up in layered, sculpted brushwork. A textured sand-coloured form and a deep ultramarine shape meet near the centre of the canvas.",
    category: "abstract",
    image: {
      src: abstractImpasto,
      alt: "Abstract painting by Blerta: sweeping strokes of pale blue, lilac, yellow and peach on a cream ground, with a textured sand-coloured triangle and a deep ultramarine form near the centre.",
    },
    framedImage: {
      src: abstractImpastoFramed,
      alt: "Blerta's abstract painting in pale blue, lilac, peach and cream, shown in a light wooden frame.",
    },
    textureFocus: { x: 46, y: 60 },
    textureZoom: 2.1,
    details: [
      { label: "Brushwork", focus: { x: 10, y: 46 }, zoom: 3.2 },
      { label: "Texture", focus: { x: 40, y: 60 }, zoom: 3.6 },
      { label: "Colour transition", focus: { x: 44, y: 32 }, zoom: 2.8 },
      { label: "Gesture", focus: { x: 64, y: 58 }, zoom: 3 },
    ],
    featured: true,
  },
  {
    slug: "allah-calligraphy",
    number: "02",
    title: null,
    workingTitle: "Allah — calligraphy",
    medium: null,
    dimensions: null,
    year: null,
    availability: null,
    description: null,
    draftDescription:
      "The name of Allah in Arabic calligraphy, painted in white over a deep violet, richly textured ground.",
    category: "calligraphy",
    image: {
      src: allahCalligraphy,
      alt: "Calligraphy painting by Blerta: the name of Allah in Arabic script, painted in white at the centre of a deep violet textured canvas.",
    },
    framedImage: {
      src: allahCalligraphyFramed,
      alt: "Blerta's calligraphy painting of the name of Allah in white on deep violet, in a slim dark frame.",
    },
    // Respectful handling of sacred text: centred, very gentle zoom only.
    textureFocus: { x: 50, y: 50 },
    textureZoom: 1.18,
    fit: "contain",
    details: [
      // Crops either show the whole word, or only the ground around it —
      // never a fragment of the sacred text.
      { label: "Calligraphic form", focus: { x: 50, y: 48 }, zoom: 1.7 },
      { label: "Ground texture", focus: { x: 14, y: 72 }, zoom: 3.2 },
      { label: "Layered violet", focus: { x: 86, y: 30 }, zoom: 3 },
    ],
    featured: true,
  },
  {
    slug: "red-eagle",
    number: "03",
    title: null,
    workingTitle: "Untitled (red & eagle)",
    medium: null,
    dimensions: null,
    year: null,
    availability: null,
    description: null,
    draftDescription:
      "A deep red, textured canvas with a black double-headed eagle at its centre.",
    category: "other",
    // Cropped from a photograph of Blerta beside the canvas — replace with a
    // dedicated high-resolution photograph when available.
    image: {
      src: eagle,
      alt: "Painting by Blerta: a black double-headed eagle at the centre of a deep red, textured canvas.",
    },
    framedImage: {
      src: eagleFramed,
      alt: "Blerta's painting of a black double-headed eagle on deep red, in a slim black frame.",
    },
  },
];

/** Real artworks only (excludes empty placeholder slots). */
export const publishedArtworks = artworks.filter(
  (a): a is Artwork & { image: NonNullable<Artwork["image"]> } =>
    !a.placeholder && Boolean(a.image),
);

export const featuredArtworks = publishedArtworks.filter((a) => a.featured);

export function getArtwork(slug: string) {
  return publishedArtworks.find((a) => a.slug === slug);
}

export function displayTitle(a: Pick<Artwork, "title" | "workingTitle">) {
  return a.title ?? a.workingTitle;
}

export const availabilityLabel: Record<NonNullable<Artwork["availability"]>, string> = {
  available: "Available",
  sold: "Sold",
  "private-collection": "Private collection",
  "not-for-sale": "Not for sale",
  enquire: "Enquire",
};

export const TBC = "To be confirmed";
