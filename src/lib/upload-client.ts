"use client";
/** PUT a file to a Supabase signed-upload URL with progress (same protocol as storage-js uploadToSignedUrl). */
export function putSigned(signedUrl: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("cacheControl", "3600");
    fd.append("", file);
    const x = new XMLHttpRequest();
    x.open("PUT", signedUrl);
    x.setRequestHeader("x-upsert", "false");
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error("Upload failed. Please try again.")));
    x.onerror = () => reject(new Error("Network error. Please try again."));
    x.send(fd);
  });
}
