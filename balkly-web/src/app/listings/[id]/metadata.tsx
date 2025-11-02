import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Fetch listing data
  const listing = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}`)
    .then((res) => res.json())
    .then((data) => data.listing)
    .catch(() => null);

  if (!listing) {
    return {
      title: "Listing Not Found - Balkly",
    };
  }

  const imageUrl = listing.media?.[0]?.url || "/images/default-listing.jpg";

  return {
    title: `${listing.title} - Balkly`,
    description: listing.description.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.substring(0, 160),
      url: `/listings/${listing.id}`,
      type: "product",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: listing.description.substring(0, 160),
      images: [imageUrl],
    },
  };
}

