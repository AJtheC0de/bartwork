import type { ApprovableText } from "@/content/types";

/**
 * Visible marker for copy that Blerta has not yet approved.
 * Disappears automatically once `approved: true` is set in content.
 */
export function ApprovalNote({
  item,
  label = "Draft — awaiting Blerta’s approval",
  tone = "light",
  className = "",
}: {
  item?: ApprovableText;
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (item?.approved) return null;
  return (
    <span
      className={`t-label inline-flex items-center gap-2 border border-dashed px-2 py-1 !text-[0.625rem] ${
        tone === "dark" ? "border-white/25 text-white/55" : "border-ink/20 text-mute"
      } ${className}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-sand" />
      {label}
    </span>
  );
}
