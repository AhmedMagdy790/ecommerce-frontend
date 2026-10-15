import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
  ogType?: "website" | "article" | "product";
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
}: SEOProps) {
  return (
    <Helmet>
      {title && <title>{title}</title>}

      {description && (
        <meta
          name="description"
          content={description}
        />
      )}

      {canonical && (
        <link
          rel="canonical"
          href={canonical}
        />
      )}

      {title && (
        <meta
          property="og:title"
          content={title}
        />
      )}

      {description && (
        <meta
          property="og:description"
          content={description}
        />
      )}

      {canonical && (
        <meta
          property="og:url"
          content={canonical}
        />
      )}

      <meta
        property="og:type"
        content={ogType}
      />

      {ogImage && (
        <meta
          property="og:image"
          content={ogImage}
        />
      )}
    </Helmet>
  );
}