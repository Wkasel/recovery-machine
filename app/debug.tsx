import Script from "next/script";

export default function Debug() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <>
      <Script
        id="env-init"
        dangerouslySetInnerHTML={{
          __html: `
              window.__env__ = {
                NEXT_PUBLIC_GOOGLE_CLIENT_ID: '${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}',
                NEXT_PUBLIC_SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}'
              };
            `,
        }}
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
        strategy="beforeInteractive"
      />
      {isDevelopment && <Script src="/debug-init.js" strategy="afterInteractive" />}
      {isDevelopment && (
        <Script
          src="https://cdn.jsdelivr.net/npm/@supabase/gotrue-js@2/dist/gotrue.min.js"
          strategy="beforeInteractive"
        />
      )}
    </>
  );
}
