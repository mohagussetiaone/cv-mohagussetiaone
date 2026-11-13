import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Konfigurasi default OpenNext untuk Cloudflare Pages.
// File ini WAJIB ada: tanpa file ini, `opennextjs-cloudflare build` berhenti
// menunggu jawaban interaktif "create one?" di stdin dan build menggantung
// selamanya (terjadi 13 Nov 2026 — build 11+ menit tanpa progres).
export default defineCloudflareConfig();
