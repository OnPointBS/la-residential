"use client";

import Head from "next/head";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noIndex = false,
}: SEOHeadProps) {
  const settings = useQuery(api.settings.get);
  
  // Use settings data as fallbacks
  const siteName = settings?.companyName || "LA Residential - A Branch of Furr Construction";
  const siteDescription = settings?.metaDescription || "Family-owned home construction and development services in North Carolina. Quality craftsmanship, modern designs, and exceptional customer service.";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://la-residential.vercel.app";
  const logoUrl = settings?.logoId ? `${siteUrl}/api/convex/files/${settings.logoId}` : `${siteUrl}/logo.webp`;
  
  // Construct final values
  const finalTitle = title ? `${title} | ${siteName}` : siteName;
  const finalDescription = description || siteDescription;
  const finalImage = image || logoUrl;
  const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  
  // Combine keywords
  const allKeywords = [
    ...keywords,
    "home construction",
    "home builder",
    "North Carolina",
    "Charlotte",
    "Fayetteville",
    "new homes",
    "custom homes",
    "floor plans",
    "residential construction",
    "family-owned",
    "Furr Construction"
  ].filter(Boolean);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "product" ? "Product" : type === "article" ? "Article" : "Organization",
    "name": finalTitle,
    "description": finalDescription,
    "url": finalUrl,
    "image": finalImage,
    "logo": logoUrl,
    ...(type === "product" && {
      "brand": {
        "@type": "Brand",
        "name": siteName
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD"
      }
    }),
    ...(type === "article" && {
      "headline": title,
      "author": {
        "@type": "Person",
        "name": author || siteName
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": logoUrl
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime,
      "articleSection": section,
      "keywords": allKeywords.join(", ")
    }),
    ...(type === "website" && {
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": settings?.companyPhone,
        "contactType": "customer service",
        "email": settings?.companyEmail
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Charlotte",
        "addressRegion": "NC",
        "addressCountry": "US"
      }
    })
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="author" content={siteName} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@LA_Residential" />
      <meta name="twitter:creator" content="@LA_Residential" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
    </Head>
  );
}
