/** Shared validation for the contact form (client + server). */

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { name: 120, email: 200, subject: 160, message: 5000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<Record<keyof ContactInput, unknown>>): {
  data?: ContactInput;
  errors: FieldErrors;
} {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactInput = {
    name: str(input.name),
    email: str(input.email),
    subject: str(input.subject),
    message: str(input.message),
  };
  const errors: FieldErrors = {};

  if (!data.name) errors.name = "Please tell us your name.";
  else if (data.name.length > LIMITS.name) errors.name = "That name is a little long.";

  if (!data.email) errors.email = "Please add your email so Blerta can reply.";
  else if (!EMAIL.test(data.email) || data.email.length > LIMITS.email)
    errors.email = "That email address doesn’t look quite right.";

  if (!data.subject) errors.subject = "Please add a subject.";
  else if (data.subject.length > LIMITS.subject) errors.subject = "Please shorten the subject.";

  if (!data.message) errors.message = "Please write a message.";
  else if (data.message.length < 10) errors.message = "Please write a little more.";
  else if (data.message.length > LIMITS.message) errors.message = "Please keep the message under 5,000 characters.";

  return Object.keys(errors).length ? { errors } : { data, errors };
}
