"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Eye,
  Share2,
  Flag,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const loadListing = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getOne(listingId);
      setListing(response.data.listing);
    } catch (error) {
      console.error("Failed to load listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    // TODO: Open chat or redirect to chat page
    router.push(`/chat?listing=${listingId}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-6" />
            <div className="h-8 bg-muted rounded w-2/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Button onClick={() => router.push("/listings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const images = listing.media || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/listings")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted relative">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage].url}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl">📦</span>
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {images.map((img: any, index: number) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{listing.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.city}, {listing.country}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {listing.views_count} views
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="whitespace-pre-wrap">{listing.description}</p>
                </div>

                {listing.listingAttributes?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {listing.listingAttributes.map((attr: any) => (
                        <div key={attr.id} className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">
                            {attr.attribute.name}
                          </span>
                          <span className="font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price & CTA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-primary">
                  €{listing.price?.toLocaleString() || "Contact"}
                </CardTitle>
                {listing.currency && (
                  <CardDescription>{listing.currency}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleContactSeller}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Make an Offer
                </Button>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {listing.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{listing.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(listing.user?.created_at).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {listing.user?.profile?.city || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response rate:</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response time:</span>
                    <span className="font-medium">Within hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Meet in a public place</p>
                <p>• Check the item before payment</p>
                <p>• Pay only after collecting item</p>
                <p>• Report suspicious listings</p>
                <p>• Don't share financial information</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

