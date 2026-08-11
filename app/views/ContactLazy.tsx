"use client";

import dynamic from "next/dynamic";

// The contact form pulls in react-hook-form + zod (+ sonner toasts).
// Lazy-load it (ssr:false) so those don't ship in the initial JS bundle
// and the section isn't hydrated on first load — it's far below the fold.
const Contact = dynamic(() => import("@/app/views/Contact"), {
  ssr: false,
  loading: () => (
    <div className="py-10 md:py-20 px-4 md:px-8" id="contact" aria-busy="true">
      <div className="flex justify-center">
        <div className="inline-block border-2 p-2 rounded-tl-xl rounded-br-xl mb-8 border-white/20">
          <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-14 animate-pulse rounded-lg bg-white/5" />
          <div className="h-14 animate-pulse rounded-lg bg-white/5" />
        </div>
        <div className="h-14 animate-pulse rounded-lg bg-white/5" />
        <div className="flex justify-end py-4">
          <div className="h-11 w-32 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  ),
});

export default function ContactLazy() {
  return <Contact />;
}
