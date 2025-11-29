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
  Euro,
  Star,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";
import FavoriteButton from "@/components/FavoriteButton";
import VerifiedBadge from "@/components/VerifiedBadge";
import PriceDisplay from "@/components/PriceDisplay";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [similarListings, setSimilarListings] = useState<any[]>([]);

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
      
      // Load seller reviews
      if (response.data.listing?.user_id) {
        const reviewsResponse = await fetch(`/api/v1/reviews/user/${response.data.listing.user_id}`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews?.data || []);
        setAvgRating(reviewsData.average_rating || 0);
      }
      
      // Load similar listings from same category
      if (response.data.listing?.category_id) {
        const similarRes = await listingsAPI.getAll({ 
          category_id: response.data.listing.category_id,
          per_page: 4,
          status: 'active'
        });
        const similar = (similarRes.data.data || []).filter((l: any) => l.id !== listingId);
        setSimilarListings(similar.slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to load listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!offerAmount) return;

    try {
      await fetch("/api/v1/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          amount: parseFloat(offerAmount),
          message: offerMessage,
        }),
      });
      
      setShowOfferModal(false);
      setOfferAmount("");
      setOfferMessage("");
      alert("Offer sent to seller!");
    } catch (error) {
      alert("Failed to send offer. Please login first.");
    }
  };

  const handleContactSeller = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to contact the seller!");
      router.push("/auth/login");
      return;
    }
    
    // Show contact modal
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      alert("Please enter a message!");
      return;
    }

    try {
      // Step 1: Start/get chat
      const chatResponse = await fetch(`/api/v1/chats/start/${listingId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!chatResponse.ok) {
        throw new Error("Failed to start chat");
      }

      const chatData = await chatResponse.json();
      const chatId = chatData.chat.id;

      // Step 2: Send message
      const messageResponse = await fetch("/api/v1/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          body: contactMessage,
        }),
      });

      if (messageResponse.ok) {
        alert("Message sent! The seller will be notified.");
        setShowContactModal(false);
        setContactMessage("");
        router.push("/dashboard/messages");
      } else {
        const data = await messageResponse.json();
        alert(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message. Please try again.");
    }
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
                    <FavoriteButton type="App\\Models\\Listing" id={parseInt(listingId)} size="sm" />
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
                {listing.price ? (
                  <PriceDisplay
                    amount={listing.price}
                    currency={listing.currency || 'EUR'}
                    className="text-4xl text-primary font-bold"
                    showOriginal={true}
                  />
                ) : (
                  <CardTitle className="text-4xl text-primary">Contact</CardTitle>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleContactSeller}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={() => setShowOfferModal(true)}>
                  <Euro className="mr-2 h-5 w-5" />
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{listing.user?.name}</p>
                      <VerifiedBadge isVerified={listing.user?.is_verified_seller} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(listing.user?.created_at).getFullYear()}
                    </p>
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{avgRating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
                      </div>
                    )}
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

        {/* Contact Seller Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Send a message to {listing.user?.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Hi! I'm interested in this listing. Is it still available?"
                    className="w-full px-4 py-2 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be polite and specific about your inquiry
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setShowContactModal(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Make Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Make an Offer</CardTitle>
                {listing.price && (
                  <p className="text-sm text-muted-foreground">
                    Original price: <PriceDisplay
                      amount={typeof listing.price === 'number' ? listing.price : parseFloat(listing.price || 0)}
                      currency={listing.currency || 'EUR'}
                    />
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Offer (€)</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your offer"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message (optional)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Add a message to the seller..."
                    className="w-full px-4 py-2 border rounded-lg h-24 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleMakeOffer} className="flex-1">
                    Send Offer
                  </Button>
                  <Button variant="outline" onClick={() => setShowOfferModal(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schema.org Structured Data */}
        {listing && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": listing.title,
                "description": listing.description,
                "image": listing.media?.map((m: any) => m.url) || [],
                "offers": {
                  "@type": "Offer",
                  "price": listing.price,
                  "priceCurrency": listing.currency,
                  "availability": "https://schema.org/InStock",
                  "url": typeof window !== 'undefined' ? window.location.href : '',
                  "seller": {
                    "@type": "Person",
                    "name": listing.user?.name,
                  },
                },
              }),
            }}
          />
        )}

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="container mx-auto px-4 py-12 bg-muted/30">
            <h2 className="text-3xl font-bold mb-8">Similar Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarListings.map((item) => (
                <Link key={item.id} href={`/listings/${item.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {item.media?.[0] ? (
                        <img 
                          src={item.media[0].url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium line-clamp-2 mb-2">{item.title}</p>
                      <PriceDisplay
                        amount={item.price}
                        currency={item.currency || 'EUR'}
                        className="text-primary font-bold"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {item.city}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

