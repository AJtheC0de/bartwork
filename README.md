# Blerta — Art Beyond Words

A digital exhibition of the work of the artist Blerta. A gift from SIXAM.

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · Motion.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Before publishing — needs Blerta's approval

Nothing below is final until Blerta has read and agreed to it. Every unapproved item shows a small dashed **"Draft — awaiting Blerta's approval"** marker on the site.

| Item | Where | Status |
|---|---|---|
| Biography | `src/content/site.ts` → `copy.meet.bio` | Draft wording from the brief |
| Faith text | `copy.faith.body` | Draft wording from the brief |
| Qur'an 57:4 excerpt | `copy.faith.verse` | Check it matches the wording in her Instagram bio |
| Her own story | `copy.story.personal` | Empty. Only her own words go here |
| Artwork titles, medium, size, year, availability | `src/content/artworks.ts` | All `null`, shown as "To be confirmed" |
| Artwork descriptions | `draftDescription` | Neutral descriptions of what is visible only |
| Portrait and process photos | `photos` in `site.ts` | Placeholders |
| Privacy page | `src/app/privacy/page.tsx` | Draft, needs legal review |

To approve a text, set `approved: true`; the marker disappears.

**Content rules:** never invent titles, dimensions, prices, years, exhibitions, awards or quotes. Never write about her health on her behalf. Never crop or animate calligraphy so the sacred text is cut or distorted. Calligraphy works use `fit: "contain"` and very low `textureZoom`, and their detail crops show either the whole word or only the surrounding canvas. Donations are deliberately not built in; add them only if Blerta asks.

## Adding an artwork

1. Put the photo(s) in `src/content/images/`: ideally one **frameless** photo of the canvas plus one **framed** photo. Use at least 3000px on the long edge, natural light and no filters.
2. Import them at the top of `src/content/artworks.ts` and add an entry to the `artworks` array (copy an existing one). The array's order is the gallery order.
3. Set `featured: true` to include it in the pinned home-page exhibition (Chapter 04).
4. Optional: `details` (label, focal point in % and zoom) for macro crops; `textureFocus` and `textureZoom` for the scroll zoom.
5. Remove one of the `placeholder: true` entries (`work-03`, `work-04`) when real works replace them.

Detail pages, sitemap, galleries and structured data update automatically.

## Replacing photos of Blerta

In `src/content/site.ts` → `photos`, import an image and set it as `src`. The placeholder walls disappear automatically. The wide story photo (Fig. 05) only renders once it has a real photo.

## Contact form

`POST /api/contact` validates the input (shared with the client), filters spam with a honeypot and a basic rate limit, and sends via the Resend HTTP API. It needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (a sender on a domain verified in Resend). If these aren't configured, it returns 503 and the visitor is told the message was **not** sent.

## Structure

```
src/
  app/                 routes: / · /works · /works/[slug] · /contact · /privacy · api/contact
  content/             typed content (site.ts, artworks.ts, types.ts) + images/
  components/
    home/              one component per chapter (Intro, Hero, MeetArtist, Exhibition, …)
    motion/            SmoothScroll (Lenis), RevealText, Reveal, Parallax
    layout/            Header + menu overlay, Footer, Cursor
    works/ ui/ contact/
  lib/                 gsap setup, intro coordination, contact validation
_source/               original supplied photographs (not served)
```

The content layer is plain typed objects shaped like CMS documents. To move to Sanity later, replace the arrays in `content/*.ts` with fetches that return the same types.

## Motion & accessibility

- All scroll animation is scrubbed and reversible. Lenis smooths the wheel only; touch keeps native momentum.
- `prefers-reduced-motion`: no Lenis, no pinning, no intro; content is laid out statically (CSS handles this before JavaScript runs).
- Without JavaScript, all content is still visible.
- The intro plays once per session and can be skipped with the button or Esc.
- The custom cursor appears only on fine pointers with hover; the native cursor is always kept.
- The menu overlay traps focus, closes with Esc, and stops background scroll.
