"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { LIMITS, validateContact, type ContactInput, type FieldErrors } from "@/lib/contact";
import { displayTitle, getArtwork } from "@/content/artworks";
import { social } from "@/content/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const MESSAGES: Record<string, string> = {
  not_configured:
    "The contact form isn’t connected to an inbox yet, so your message was not sent. Please reach Blerta on Instagram for now.",
  rate_limited: "Too many messages in a short time. Please try again a little later.",
  delivery_failed: "Something went wrong while sending. Your message was not sent — please try again.",
  default: "Your message could not be sent. Please try again, or reach Blerta on Instagram.",
};

export function ContactForm() {
  const params = useSearchParams();
  const artwork = getArtwork(params.get("artwork") ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<keyof ContactInput | "website", string>;
    const { data, errors } = validateContact(raw);
    setErrors(errors);
    if (!data) {
      const first = Object.keys(errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: raw.website ?? "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: FieldErrors };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        formRef.current?.reset();
      } else {
        if (json.errors) setErrors(json.errors);
        setStatus({ kind: "error", message: MESSAGES[json.error ?? ""] ?? MESSAGES.default });
      }
    } catch {
      setStatus({ kind: "error", message: MESSAGES.default });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const field = (
    name: keyof ContactInput,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { multiline?: boolean } = {},
  ) => {
    const id = `${uid}-${name}`;
    const err = errors[name];
    const { multiline, ...rest } = props;
    const cls =
      "peer w-full border-0 border-b bg-transparent px-0 pt-7 pb-3 text-[1.0625rem] text-ink outline-none transition-colors duration-500 placeholder:text-transparent focus:border-ink focus-visible:outline-none " +
      (err ? "border-[#9a4a3a]" : "border-ink/20 hover:border-ink/50");
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={6}
            placeholder={label}
            maxLength={LIMITS[name]}
            aria-invalid={Boolean(err)}
            aria-describedby={err ? `${id}-err` : undefined}
            className={`${cls} min-h-40 resize-y leading-relaxed`}
            required
          />
        ) : (
          <input
            id={id}
            name={name}
            placeholder={label}
            maxLength={LIMITS[name]}
            aria-invalid={Boolean(err)}
            aria-describedby={err ? `${id}-err` : undefined}
            className={cls}
            required
            {...rest}
          />
        )}
        <label
          htmlFor={id}
          className="t-label pointer-events-none absolute top-8 left-0 origin-left text-mute transition-all duration-500 ease-[var(--ease-gallery)] peer-focus:top-1 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:scale-90"
        >
          {label}
        </label>
        {err ? (
          <p id={`${id}-err`} className="t-num mt-2 text-[#9a4a3a]">
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {field("name", "Name", { autoComplete: "name" })}
      {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
      {field("subject", "Subject", {
        defaultValue: artwork ? `Enquiry — ${displayTitle(artwork)}` : undefined,
      })}
      {field("message", "Message", { multiline: true })}

      {/* Honeypot (hidden from people and assistive tech) */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="t-label group inline-flex min-h-12 items-center gap-4 bg-ink px-8 text-paper transition-colors duration-500 hover:bg-night disabled:cursor-wait disabled:opacity-60"
        >
          {status.kind === "sending" ? "Sending…" : "Send message"}
          <svg aria-hidden viewBox="0 0 24 10" className="h-2.5 w-6 transition-transform duration-700 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 5h22M18 1l4 4-4 4" />
          </svg>
        </button>
        <p className="t-num text-mute">
          Or message{" "}
          <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
            {social.instagram.handle}
            <span className="sr-only"> on Instagram (opens in a new tab)</span>
          </a>
        </p>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        <AnimatePresence mode="wait">
          {status.kind === "sent" ? (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="t-lead border-t border-line pt-6 text-ink"
            >
              Thank you — your message has been sent.
            </motion.p>
          ) : status.kind === "error" ? (
            <motion.p
              key="error"
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="t-body border-t border-[#9a4a3a]/40 pt-6 text-[#7d3a2d]"
            >
              {status.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
