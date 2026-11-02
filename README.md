# Ignixales: E-commerce Campaign Creative Studio

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, Auth, Storage).

## Quick start
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```
Without Supabase env vars the public site still runs from built-in defaults (concept projects, default packages); forms, uploads and admin need Supabase.

## Supabase setup
1. Create a project. Run `supabase/migrations/0001_init.sql` in the SQL editor (tables, RLS, buckets `portfolio` (public) and `project-assets` (private)).
2. Auth → create a user (email + password) for each admin, and list their emails in `ADMIN_EMAILS`.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only).
4. Optional: `RESEND_API_KEY`, `EMAIL_FROM`, `TEAM_NOTIFY_EMAIL` for confirmation/notification emails (otherwise logged to console); GTM/GA/Meta Pixel IDs; Turnstile keys.
5. Sign in at `/admin`.

## How things work
- **Content/CMS**: packages, prices, add-ons, stats, FAQ, contact/social, services, campaigns and team live in `site_content` (edit in `/admin/content`); defaults are in `src/lib/defaults.ts`.
- **Prices** are server-authoritative: `/api/submit` recomputes the estimate from stored prices.
- **Portfolio**: `/admin/portfolio` (create, upload cover and gallery images directly to storage, reorder, feature, publish, delete). Until a project is published, clearly-labelled concept samples show.
- **Uploads**: browser → signed URL → private bucket; server then verifies real file type by magic bytes (PNG/JPG/WEBP/PDF/SVG/ZIP, 25 MB, 30 files). Admins download via short-lived signed URLs.
- **Spam**: honeypot, minimum fill time, in-memory rate limit (swap for Redis if multi-instance), optional Turnstile.
- **Analytics**: loaded only after cookie consent. Events: `package_click`, `project_form_start`, `project_form_submit`, `file_upload`, `contact_submit`, `website_enquiry_submit`.

## Before launch (needs your input)
- Review package prices, add-on prices and delivery times (suggested values only).
- Stats show `[NUMBER]` placeholders until you enter verified figures. Testimonials/team hide until real ones are added.
- Terms and Privacy pages are templates and need legal review.
- No online payment is integrated: submissions are requests; the team confirms price and payment by email.
- Add a lifecycle rule to delete abandoned `drafts/` files in `project-assets`.
- Not tested against a live Supabase project in development: run through the form, upload and admin flows once after setup.
