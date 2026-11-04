import type { Metadata } from "next";
import { agency } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  robots: { index: false },
  alternates: { canonical: "/privacy" },
};

/**
 * DRAFT — requires legal review before publication.
 * Describes only what this codebase actually does. Update it if hosting,
 * email provider, analytics or embeds change.
 */
export default function PrivacyPage() {
  return (
    <div className="gutter pt-[calc(var(--header-h)+14svh)]">
      <div className="mx-auto max-w-[42rem]">
        <p className="t-label mb-6 inline-flex border border-dashed border-ink/25 px-2 py-1 text-mute">
          Draft — requires review before publication
        </p>
        <h1 className="t-h2 text-ink">Privacy</h1>

        <div className="t-body mt-12 space-y-6 text-ink/85 [&_h2]:t-label [&_h2]:pt-6 [&_h2]:text-ink">
          <p>
            This website presents the artwork of Blerta. It is designed to collect as little personal
            information as possible.
          </p>

          <h2>What we collect</h2>
          <p>
            The site uses no analytics, advertising trackers or third-party cookies. If you send a
            message through the contact form, the name, email address, subject and message you enter
            are sent by email to Blerta so she can reply. They are not stored in a database on this
            website.
          </p>

          <h2>Service providers</h2>
          <p>
            [To complete: hosting provider and email delivery provider (e.g. Resend), including where
            data is processed.]
          </p>

          <h2>Your rights</h2>
          <p>
            [To complete: how to request access to or deletion of messages, and the applicable data
            protection law.]
          </p>

          <h2>Contact</h2>
          <p>[To complete: contact details for privacy questions.]</p>

          <p className="t-num pt-8 text-mute">
            Website by {agency.name}. Last updated: [date to add on publication].
          </p>
        </div>
      </div>
    </div>
  );
}
