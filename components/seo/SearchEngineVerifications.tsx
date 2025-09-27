"use client";

/**
 * Search Engine Verification Component
 * Provides verification meta tags for major search engines and webmaster tools
 */
export function SearchEngineVerifications() {
  return (
    <>
      {/* Google Search Console */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      )}

      {/* Bing Webmaster Tools */}
      {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
        <meta
          name="msvalidate.01"
          content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION}
        />
      )}

      {/* Yandex Webmaster */}
      {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
        <meta
          name="yandex-verification"
          content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION}
        />
      )}

      {/* Pinterest Domain Verification */}
      {process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION && (
        <meta
          name="p:domain_verify"
          content={process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION}
        />
      )}

      {/* Facebook Domain Verification */}
      {process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION && (
        <meta
          name="facebook-domain-verification"
          content={process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION}
        />
      )}

      {/* Apple Mobile Web App Capable */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Recovery Machine" />

      {/* Microsoft Tiles */}
      <meta name="msapplication-TileColor" content="#00a300" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Theme Color */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

      {/* Verification for wellness/health directories */}
      {process.env.NEXT_PUBLIC_WELLNESS_DIRECTORY_VERIFICATION && (
        <meta
          name="wellness-directory-verification"
          content={process.env.NEXT_PUBLIC_WELLNESS_DIRECTORY_VERIFICATION}
        />
      )}

      {/* Healthcare compliance verification */}
      <meta name="health-on-the-net-certification" content="HON-compliant" />
      
      {/* Mobile optimization indicators */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
    </>
  );
}

export default SearchEngineVerifications;