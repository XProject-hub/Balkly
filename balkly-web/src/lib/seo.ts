/**
 * SEO and Schema.org utilities
 */

export interface ListingSchema {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  country: string;
  images: string[];
  seller: {
    name: string;
  };
  created_at: string;
}

export interface EventSchema {
  id: number;
  title: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  start_at: string;
  end_at?: string;
  image_url?: string;
}

/**
 * Generate Schema.org Product markup for listing
 */
export function generateListingSchema(listing: ListingSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "description": listing.description,
    "image": listing.images,
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": listing.currency,
      "availability": "https://schema.org/InStock",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/listings/${listing.id}`,
      "seller": {
        "@type": "Person",
        "name": listing.seller.name,
      },
    },
    "category": "Marketplace Listing",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": listing.city,
        "addressCountry": listing.country,
      },
    },
  };
}

/**
 * Generate Schema.org Event markup
 */
export function generateEventSchema(event: EventSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.start_at,
    "endDate": event.end_at,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.city,
        "addressCountry": event.country,
      },
    },
    "image": event.image_url ? [event.image_url] : [],
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.id}`,
      "availability": "https://schema.org/InStock",
    },
  };
}

/**
 * Generate Open Graph meta tags
 */
export function generateOGTags(data: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}) {
  return {
    title: data.title,
    description: data.description,
    url: data.url,
    type: data.type || "website",
    images: data.image
      ? [
          {
            url: data.image,
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ]
      : [],
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags(data: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: "summary_large_image",
    title: data.title,
    description: data.description,
    images: data.image ? [data.image] : [],
  };
}

