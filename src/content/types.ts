import type { StaticImageData } from "next/image";

/**
 * Content model. Shaped so each type maps 1:1 to a future headless CMS
 * document (e.g. a Sanity `artwork` schema) — swap the static imports in
 * `artworks.ts` for a fetch and the components keep working.
 */

/** A focal point in percent (0–100) of the image width/height. */
export type FocalPoint = { x: number; y: number };

export type ArtworkImage = {
  src: StaticImageData;
  alt: string;
};

/**
 * A further view of a work, shown on its detail page.
 *  - "photo": the work photographed in a real room.
 *  - "detail": a close-up photograph of the paint surface.
 *  - "visualisation": the work placed in a rendered interior. Always
 *    labelled as such, never presented as a real photograph.
 */
export type ArtworkView = ArtworkImage & {
  kind: "photo" | "detail" | "visualisation";
};

export type ArtworkDetail = {
  /** Short label, e.g. "Brushwork". Describe only what is visible. */
  label: string;
  focus: FocalPoint;
  /** How far to zoom into the source photograph (1 = whole image). */
  zoom: number;
};

export type Availability =
  | "available"
  | "sold"
  | "private-collection"
  | "not-for-sale"
  | "enquire";

export type Artwork = {
  slug: string;
  /** Exhibition-style number shown as "01 / Selected work". */
  number: string;
  /** Leave `null` until Blerta confirms the title. */
  title: string | null;
  /** Fallback shown while the title is unconfirmed. */
  workingTitle: string;
  medium: string | null;
  /** Free text, e.g. "100 × 150 cm". Never estimate. */
  dimensions: string | null;
  year: string | null;
  availability: Availability | null;
  /** Approved description. `null` = nothing approved yet. */
  description: string | null;
  /** Neutral, visual-only description used while awaiting approval. */
  draftDescription?: string;
  category: "abstract" | "calligraphy" | "other";

  /** Frameless photograph of the canvas, used for full-bleed moments. */
  image?: ArtworkImage;
  /** Photograph including the frame, used for "museum piece" moments. */
  framedImage?: ArtworkImage;
  /** Further photographs and visualisations, in display order. */
  views?: ArtworkView[];

  /** Where to zoom for texture moments (percent of image). */
  textureFocus?: FocalPoint;
  /** Max zoom for scroll-linked texture reveal. Keep low for sacred text. */
  textureZoom?: number;
  /**
   * How the work fills the screen in the exhibition sequence.
   * "contain" keeps the whole work visible (always used for calligraphy,
   * so sacred text is never cropped).
   */
  fit?: "cover" | "contain";
  details?: ArtworkDetail[];

  /** Show in the immersive home-page exhibition sequence. */
  featured?: boolean;
  /**
   * Placeholder slot — no real artwork photograph yet. Rendered as a
   * clearly-labelled empty gallery wall, never as a real piece.
   */
  placeholder?: boolean;
};

/** Copy that must be approved by Blerta before it is published as final. */
export type ApprovableText = {
  text: string;
  approved: boolean;
};

export type Photo = {
  /** `null` until a real, approved photograph is supplied. */
  src: StaticImageData | null;
  alt: string;
  caption: string;
  /** CSS object-position for cropping, e.g. "15% 40%". */
  position?: string;
};
