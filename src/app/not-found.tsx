import { ArrowLink } from "@/components/ui/ArrowLink";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[80svh] flex-col justify-end pt-[calc(var(--header-h)+10svh)] pb-10">
      <p className="t-num mb-6 text-mute">404</p>
      <h1 className="t-h1 max-w-[12ch] text-ink">
        This wall is <em className="italic">empty.</em>
      </h1>
      <p className="t-lead mt-8 max-w-[30ch] text-ink/70">
        The page you were looking for isn’t part of the exhibition.
      </p>
      <div className="mt-12 flex flex-wrap gap-10">
        <ArrowLink href="/">Return home</ArrowLink>
        <ArrowLink href="/works">View the works</ArrowLink>
      </div>
    </div>
  );
}
