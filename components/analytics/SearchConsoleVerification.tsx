interface SearchConsoleVerificationProps {
  verificationCode?: string;
}

export function SearchConsoleVerification({ 
  verificationCode = process.env.GOOGLE_SITE_VERIFICATION 
}: SearchConsoleVerificationProps) {
  if (!verificationCode) {
    return null;
  }

  return (
    <meta name="google-site-verification" content={verificationCode} />
  );
}

// Additional verification meta tags for other search engines
export function SearchEngineVerifications() {
  return (
    <>
      {/* Google Search Console */}
      {process.env.GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
      )}
      
      {/* Bing Webmaster Tools */}
      {process.env.BING_SITE_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.BING_SITE_VERIFICATION} />
      )}
      
      {/* Yandex Webmaster */}
      {process.env.YANDEX_VERIFICATION && (
        <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION} />
      )}
      
      {/* Baidu Webmaster */}
      {process.env.BAIDU_SITE_VERIFICATION && (
        <meta name="baidu-site-verification" content={process.env.BAIDU_SITE_VERIFICATION} />
      )}

      {/* Pinterest Domain Verification */}
      {process.env.PINTEREST_VERIFICATION && (
        <meta name="p:domain_verify" content={process.env.PINTEREST_VERIFICATION} />
      )}
    </>
  );
}