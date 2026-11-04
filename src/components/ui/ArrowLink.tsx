import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: "ink" | "paper";
  variant?: "solid" | "line";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">;

/** Editorial call-to-action: small uppercase label, hairline, arrow. */
export function ArrowLink({
  href,
  children,
  external,
  tone = "ink",
  variant = "line",
  className = "",
  ...rest
}: Props) {
  const base =
    "group t-label relative inline-flex min-h-12 items-center gap-4 transition-colors duration-500";
  const styles =
    variant === "solid"
      ? tone === "ink"
        ? "bg-ink px-7 text-paper hover:bg-night"
        : "bg-paper px-7 text-ink hover:bg-ivory"
      : tone === "ink"
        ? "border-b border-ink/30 pb-1 text-ink hover:border-ink"
        : "border-b border-paper/30 pb-1 text-paper hover:border-paper";

  const inner = (
    <>
      <span>{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 24 10"
        className="h-2.5 w-6 transition-transform duration-700 ease-[var(--ease-gallery)] group-hover:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 5h22M18 1l4 4-4 4" />
      </svg>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${styles} ${className}`}
      >
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles} ${className}`} {...rest}>
      {inner}
    </Link>
  );
}
