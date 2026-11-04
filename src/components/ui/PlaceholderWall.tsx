/**
 * An honest empty gallery wall. Used wherever a real photograph or artwork
 * has not been supplied yet — never filled with stand-in imagery.
 */
export function PlaceholderWall({
  label = "Photograph to come",
  note,
  className = "",
  tone = "light",
}: {
  label?: string;
  note?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}${note ? ` — ${note}` : ""}`}
      className={`placeholder-wall relative flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center ${
        tone === "dark" ? "!bg-white/5" : ""
      } ${className}`}
    >
      <span aria-hidden className="block h-px w-8 bg-mute/50" />
      <span className="t-label text-mute">{label}</span>
      {note ? <span className="t-num max-w-[22ch] text-mute/80">{note}</span> : null}
      <span className="t-num absolute right-3 bottom-3 text-mute/60">Placeholder</span>
    </div>
  );
}
