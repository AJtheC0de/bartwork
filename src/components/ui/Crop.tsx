import Image, { type StaticImageData } from "next/image";
import type { FocalPoint } from "@/content/types";

type Props = {
  src: StaticImageData;
  alt: string;
  focus: FocalPoint;
  /** 1 = the whole image covers the box; 3 = a third of its width. */
  zoom: number;
  /** Box aspect ratio (width / height). */
  aspect: number;
  /** Approximate rendered width of the *box* in vw, for srcset selection. */
  boxVw: number;
  className?: string;
  innerProps?: React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
};

/**
 * Shows a magnified region of a photograph without any image processing:
 * the full image is laid out larger than its box and positioned so the
 * focal point sits as close to the centre as the edges allow.
 */
export function Crop({ src, alt, focus, zoom, aspect, boxVw, className = "", innerProps }: Props) {
  const imgAspect = src.width / src.height;
  // Width/height of the laid-out image in % of the box.
  let W = Math.max(1, zoom) * 100;
  let H = (W * aspect) / imgAspect;
  if (H < 100) {
    H = 100;
    W = (H * imgAspect) / aspect;
  }
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const left = clamp(50 - (focus.x / 100) * W, 100 - W, 0);
  const top = clamp(50 - (focus.y / 100) * H, 100 - H, 0);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: aspect }}>
      <div {...innerProps} className={`absolute inset-0 ${innerProps?.className ?? ""}`}>
        <div className="absolute" style={{ width: `${W}%`, height: `${H}%`, left: `${left}%`, top: `${top}%` }}>
          <Image
            src={src}
            alt={alt}
            fill
            quality={90}
            placeholder="blur"
            sizes={`${Math.round((boxVw * W) / 100)}vw`}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
