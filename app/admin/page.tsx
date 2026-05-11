"use client";

import { useEffect } from "react";

/**
 * AdminPage component handles the Decap CMS interface.
 * It loads the CMS script dynamically and provides a mount point.
 * This approach integrates the CMS directly into the Next.js App Router,
 * resolving TypeScript route validation errors.
 */
export default function AdminPage() {
  useEffect(() => {
    // Inject the Decap CMS script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.async = true;
    document.body.appendChild(script);

    // Register preview styles if they exist
    script.onload = () => {
      // window.CMS.registerPreviewStyle("/admin/preview.css");
    };

    return () => {
      // Cleanup: remove the script and the CMS UI if necessary
      // Note: Decap CMS usually takes over the body, so a full refresh 
      // is often needed when leaving the admin area anyway.
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="nc-root" />
  );
}

declare global {
  interface Window {
    CMS: any;
  }
}
