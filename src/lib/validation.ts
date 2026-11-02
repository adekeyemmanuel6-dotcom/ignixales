import { z } from "zod";

export const MAX_FILE_MB = 25;
export const MAX_FILES = 30;
export const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "pdf", "svg", "zip"] as const;
export const FILE_CATEGORIES = ["logo", "guidelines", "product-photos", "mockups", "existing-designs", "references", "documents", "other"] as const;

const t = (max = 200) => z.string().trim().max(max);
const req = (label: string, max = 200) => z.string().trim().min(1, `${label} is required`).max(max);
const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(200);
const optUrl = z.string().trim().max(300).refine((v) => !v || /^(https?:\/\/)?[^\s.]+\.[^\s]+$/.test(v), "Enter a valid URL").optional().or(z.literal(""));

/** Anti-spam fields shared by all public forms */
const spam = { website_hp: z.string().max(0).optional(), started_at: z.coerce.number().optional(), turnstile: z.string().optional() };

export const submissionSchema = z.object({
  draftToken: z.string().regex(/^[a-zA-Z0-9-]{16,64}$/),
  packageSlug: z.string().min(1, "Select a package"),
  services: z.object({ banner: z.coerce.number().int().min(0).max(100), flyer: z.coerce.number().int().min(0).max(100), social: z.coerce.number().int().min(0).max(100), email: z.coerce.number().int().min(0).max(100) }),
  addons: z.array(z.object({ id: z.string(), qty: z.coerce.number().int().min(1).max(20) })).max(20),
  customer: z.object({
    fullName: req("Full name", 120), businessName: req("Business name", 160), email, websiteUrl: optUrl,
    country: req("Country", 80), industry: req("Industry", 80), platform: t(80).optional(),
  }),
  campaign: z.object({
    name: req("Campaign name", 160), type: req("Campaign type", 60), startDate: t(20).optional(), endDate: t(20).optional(),
    audience: t(500).optional(), objective: req("Main campaign objective", 1000), offer: t(500).optional(), direction: t(1000).optional(),
  }),
  extra: z.object({
    description: t(4000).optional(), links: t(2000).optional(), instructions: t(3000).optional(),
    contactMethod: z.enum(["email", "whatsapp", "phone", "video-call"]).default("email"),
  }),
  terms: z.literal(true, { error: "You must agree to the terms and privacy policy" }),
  ...spam,
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

export const contactSchema = z.object({
  name: req("Name", 120), email, business: t(160).optional(), subject: req("Subject", 200),
  message: req("Message", 4000).min(10, "Please add a little more detail"),
  service: t(80).optional(), budget: t(80).optional(), ...spam,
});

export const websiteSchema = z.object({
  name: req("Name", 120), business: req("Business name", 160), email,
  existingSite: optUrl, platform: t(80).optional(), projectType: req("Type of project", 80),
  features: t(1500).optional(), budget: t(80).optional(), description: req("Project description", 4000), ...spam,
});

export const fileExt = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

/** Verify real content type from magic bytes – never trust the browser-supplied MIME. */
export function sniff(buf: Buffer, ext: string): boolean {
  const h = (n: number) => buf.subarray(0, n);
  switch (ext) {
    case "png": return h(8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "jpg": case "jpeg": return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "webp": return h(4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
    case "pdf": return h(5).toString() === "%PDF-";
    case "zip": return buf[0] === 0x50 && buf[1] === 0x4b;
    case "svg": {
      const s = buf.subarray(0, 4096).toString("utf8").toLowerCase();
      return s.includes("<svg") && !/<script|onload=|onerror=|javascript:/.test(buf.toString("utf8").toLowerCase());
    }
    default: return false;
  }
}
export const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", pdf: "application/pdf", svg: "image/svg+xml", zip: "application/zip",
};
