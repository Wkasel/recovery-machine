# SEO Environment Variables

This document outlines the environment variables needed for optimal SEO performance and search engine verification.

## Search Engine Verification Variables

Add these to your `.env.local` file:

```bash
# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code

# Bing Webmaster Tools  
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_verification_code

# Yandex Webmaster
NEXT_PUBLIC_YANDEX_VERIFICATION=your_yandex_verification_code

# Pinterest Domain Verification
NEXT_PUBLIC_PINTEREST_VERIFICATION=your_pinterest_verification_code

# Facebook Domain Verification
NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION=your_facebook_verification_code

# Wellness Directory Verification (if applicable)
NEXT_PUBLIC_WELLNESS_DIRECTORY_VERIFICATION=your_wellness_directory_code
```

## Site Configuration Variables

```bash
# Primary site URL (required for canonical URLs and structured data)
NEXT_PUBLIC_APP_URL=https://therecoverymachine.com
NEXT_PUBLIC_SITE_URL=https://therecoverymachine.com

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## How to Obtain Verification Codes

### Google Search Console
1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add your property (therecoverymachine.com)
3. Choose "HTML tag" verification method
4. Copy the content value from the meta tag

### Bing Webmaster Tools
1. Visit [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Choose "Meta tag" verification
4. Copy the content value

### Yandex Webmaster
1. Visit [Yandex Webmaster](https://webmaster.yandex.com/)
2. Add your site
3. Choose "Meta tag" verification
4. Copy the content value

## SEO Features Enabled

With these environment variables configured, the following SEO features will be active:

✅ **Search Engine Verification**
- Google Search Console integration
- Bing Webmaster Tools integration  
- Yandex Webmaster integration
- Social platform verifications

✅ **Structured Data**
- Local Business schema
- Wellness service schema
- Organization schema
- Website schema

✅ **AI Discovery**
- LLMs.txt file for AI model training
- AI.txt file in .well-known directory
- Robots.txt with AI crawler directives

✅ **Healthcare Compliance**
- Health disclaimers on all pages
- Medical advice disclaimers
- Professional certification claims

✅ **Performance Optimization**
- Core Web Vitals tracking
- Enhanced analytics integration
- Performance monitoring endpoint

## Verification Steps

After adding environment variables:

1. Redeploy your application
2. Visit each search engine's webmaster tools
3. Verify ownership using the meta tag method
4. Submit your sitemap: `https://therecoverymachine.com/sitemap.xml`
5. Test LLMs.txt discovery: `https://therecoverymachine.com/llms.txt`

## Monitoring

Monitor SEO performance through:
- Google Search Console for search visibility
- Core Web Vitals reports for performance
- Analytics for user engagement
- Structured data testing tools for schema validation