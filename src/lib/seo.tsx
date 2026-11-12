import { business, faqs, products, type Product } from "@/data/site";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.infinitywindoors.com";

export const abs = (path: string) => new URL(path, SITE_URL).toString();

/* ---------- JSON-LD builders ---------- */

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": abs("/#organization"),
    name: business.brand,
    legalName: business.legalName,
    url: SITE_URL,
    logo: business.logo,
    image: business.logo,
    telephone: business.phones.map((p) => p.label),
    email: business.email,
    foundingDate: "2012",
    slogan: business.tagline,
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Plot No GEN 17/14, Behind State Bank Of India, Satpur",
        addressLocality: "Nashik",
        postalCode: "422007",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "F-58, near R.L.Square, MIDC",
        addressLocality: "Jalgaon",
        postalCode: "425003",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    ],
    areaServed: ["Nashik", "Jalgaon", "Mumbai", "Pune", "Chhatrapati Sambhajinagar", "Ahmedabad", "Vadodara", "Indore", "Maharashtra", "India"],
    sameAs: [business.social.facebook, business.social.twitter, business.social.linkedin, business.social.youtube],
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: p.title, url: abs(`/products/${p.slug}`) },
    })),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: SITE_URL,
    name: business.brand,
    publisher: { "@id": abs("/#organization") },
    inLanguage: "en-IN",
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: [p.mainImage, ...p.subProducts.map((s) => s.image)],
    url: abs(`/products/${p.slug}`),
    brand: { "@type": "Brand", name: business.brand },
    manufacturer: { "@id": abs("/#organization") },
    material: "Galvanised steel, pure polyester powder coating",
    hasVariant: p.subProducts.map((s) => ({ "@type": "Product", name: s.title, image: s.image })),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: abs("/contact-us"),
      description: "Made to measure; price on enquiry.",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** Renders one or more JSON-LD blocks. */
export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}
