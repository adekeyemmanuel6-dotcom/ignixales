"use client";
/** Tracking events: package_click, project_form_start, project_form_submit, file_upload, contact_submit, website_enquiry_submit */
type Params = Record<string, string | number | boolean | undefined>;
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void } }

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...params });
    window.gtag?.("event", event, params);
    if (event === "project_form_submit") window.fbq?.("track", "Lead", params);
    else if (event === "package_click") window.fbq?.("trackCustom", "PackageClick", params);
    else window.fbq?.("trackCustom", event, params);
  } catch { /* analytics must never break the UI */ }
}
