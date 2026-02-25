"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Package,
  Trash2,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";
import FavoriteButton from "@/components/FavoriteButton";
import VerifiedBadge from "@/components/VerifiedBadge";
import PriceDisplay from "@/components/PriceDisplay";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

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
        const similar = (similarRes.data.data || []).filter((l: any) => String(l.id) !== listingId);
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

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert(t.listingDetail.loginToOffer);
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("/api/v1/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          amount: parseFloat(offerAmount),
          message: offerMessage,
        }),
      });
      
      if (response.ok) {
        setShowOfferModal(false);
        setOfferAmount("");
        setOfferMessage("");
        alert(t.listingDetail.offerSent);
      } else {
        const data = await response.json();
        alert(data.message || t.listingDetail.failedOffer);
      }
    } catch (error) {
      alert(t.listingDetail.failedOffer);
    }
  };

  const handleContactSeller = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert(t.listingDetail.loginToContact);
      router.push("/auth/login");
      return;
    }
    
    // Show contact modal
    setShowContactModal(true);
  };

  const handleDeleteListing = async () => {
    console.log('🗑️ handleDeleteListing called for listing:', listingId);
    
    if (!confirm(t.listingDetail.confirmDelete)) {
      console.log('🗑️ User cancelled deletion');
      return;
    }
    
    console.log('🗑️ User confirmed deletion, calling API...');
    
    try {
      // Use full URL to bypass Next.js routing
      const API_URL = process.env.NEXT_PUBLIC_API_URL || window.location.origin + '/api/v1';
      const response = await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      console.log('🗑️ API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🗑️ Listing deleted:', data);
        alert(t.listingDetail.deleted);
        router.push('/listings');
      } else {
        const errorText = await response.text();
        console.error('🗑️ Delete failed:', errorText);
        alert(t.listingDetail.failedDelete);
      }
    } catch (error) {
      console.error('🗑️ Delete error:', error);
      alert(t.listingDetail.failedDelete);
    }
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      alert(t.listingDetail.enterMessage);
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
        alert(t.listingDetail.messageSent);
        setShowContactModal(false);
        setContactMessage("");
        router.push("/dashboard/messages");
      } else {
        const data = await messageResponse.json();
        alert(data.message || t.listingDetail.failedMessage);
      }
    } catch (error) {
      console.error("Send message error:", error);
      alert(t.listingDetail.failedMessage);
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
      alert(t.listingDetail.linkCopied);
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
          <h1 className="text-2xl font-bold mb-4">{t.listingDetail.listingNotFound}</h1>
          <Button onClick={() => router.push("/listings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.listingDetail.backToListings}
          </Button>
        </div>
      </div>
    );
  }

  const images = listing.media || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/listings")}
            className="text-sm"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            {t.listingDetail.backToListings}
          </Button>
          
          <div className="flex gap-2">
            {(currentUser?.id === listing?.user_id || currentUser?.role === 'admin') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/listings/${listingId}/edit`)}
                className="text-xs sm:text-sm"
              >
                Edit
              </Button>
            )}
            {currentUser?.role === 'admin' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteListing}
                className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
              >
                <Trash2 className="mr-1 sm:mr-2 h-4 w-4" />
                {t.listingDetail.delete}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2 break-words">{listing.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {listing.city}, {listing.country}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {listing.views_count} {t.listingDetail.views}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <FavoriteButton type="App\\Models\\Listing" id={parseInt(listingId)} size="sm" />
                    <Button size="sm" variant="outline" onClick={handleShare} className="w-8 h-8 sm:w-9 sm:h-9 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400 gap-1 text-xs px-2"
                      onClick={() => {
                        const token = localStorage.getItem("auth_token");
                        if (!token) {
                          alert(t.listingDetail.loginToReport);
                          router.push("/auth/login");
                          return;
                        }
                        setShowReportModal(true);
                      }}
                    >
                      <Flag className="h-3 w-3" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="prose max-w-none">
                  <h3 className="font-bold text-base sm:text-lg mb-2">{t.listingDetail.description}</h3>
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{listing.description}</p>
                </div>

                {listing.listingAttributes?.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t.listingDetail.specifications}</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
                      {listing.listingAttributes.map((attr: any) => (
                        <div key={attr.id} className="flex justify-between py-2 border-b text-sm">
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

          {/* Sidebar - Fixed on mobile at bottom */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Price & CTA - Sticky on mobile */}
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="p-4 sm:p-6">
                {listing.price ? (
                  <PriceDisplay
                    amount={listing.price}
                    currency={listing.currency || 'EUR'}
                    className="text-2xl sm:text-3xl lg:text-4xl text-primary font-bold"
                    showOriginal={true}
                  />
                ) : (
                  <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-primary">{t.listingDetail.contact}</CardTitle>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                <Button className="w-full" size="default" onClick={handleContactSeller}>
                  <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t.listingDetail.contactSeller}
                </Button>
                <Button variant="outline" className="w-full" size="default" onClick={() => setShowOfferModal(true)}>
                  <Euro className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t.listingDetail.makeOffer}
                </Button>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">{t.listingDetail.sellerInfo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
                    {listing.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base truncate">{listing.user?.name}</p>
                      <VerifiedBadge isVerified={listing.user?.is_verified_seller} size="sm" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t.listingDetail.memberSince} {new Date(listing.user?.created_at).getFullYear()}
                    </p>
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-xs sm:text-sm">{avgRating.toFixed(1)}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">({reviews.length} {t.listingDetail.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.listingDetail.location}</span>
                    <span className="font-medium truncate max-w-[120px]">
                      {listing.user?.profile?.city || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.listingDetail.responseRate}</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.listingDetail.responseTime}</span>
                    <span className="font-medium">{t.listingDetail.withinHours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips - Hidden on mobile, shown on larger screens */}
            <Card className="hidden sm:block">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">{t.listingDetail.safetyTips}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2 text-xs sm:text-sm">
                <p>• {t.listingDetail.tip1}</p>
                <p>• {t.listingDetail.tip2}</p>
                <p>• {t.listingDetail.tip3}</p>
                <p>• {t.listingDetail.tip4}</p>
                <p>• {t.listingDetail.tip5}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Seller Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{t.listingDetail.contactSeller}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t.listingDetail.sendMessage} {listing.user?.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.listingDetail.yourMessage}</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={t.listingDetail.defaultMessage}
                    className="w-full px-4 py-2 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.listingDetail.messageHint}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t.listingDetail.sendBtn}
                  </Button>
                  <Button variant="outline" onClick={() => setShowContactModal(false)}>
                    {t.listingDetail.cancel}
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
                <CardTitle>{t.listingDetail.makeOffer}</CardTitle>
                {listing.price && (
                  <p className="text-sm text-muted-foreground">
                    {t.listingDetail.originalPrice} <PriceDisplay
                      amount={typeof listing.price === 'number' ? listing.price : parseFloat(listing.price || 0)}
                      currency={listing.currency || 'EUR'}
                    />
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.listingDetail.yourOffer}</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder={t.listingDetail.enterOffer}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.listingDetail.messageOptional}</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder={t.listingDetail.addMessage}
                    className="w-full px-4 py-2 border rounded-lg h-24 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleMakeOffer} className="flex-1">
                    {t.listingDetail.sendOffer}
                  </Button>
                  <Button variant="outline" onClick={() => setShowOfferModal(false)}>
                    {t.listingDetail.cancel}
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
          <div className="mt-8 sm:mt-12 py-8 sm:py-12 bg-muted/30 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 px-0 sm:px-4 lg:px-6">{t.listingDetail.similarListings}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-0 sm:px-4 lg:px-6">
              {similarListings.map((item) => (
                <Link key={item.id} href={`/listings/${item.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {item.media?.[0] ? (
                        <img 
                          src={item.media[0].url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <p className="font-medium line-clamp-2 mb-2 text-sm sm:text-base">{item.title}</p>
                      <PriceDisplay
                        amount={item.price}
                        currency={item.currency || 'EUR'}
                        className="text-primary font-bold text-sm sm:text-base"
                      />
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Report Listing
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Help us keep Balkly safe. Select a reason and describe the issue.
            </p>

            <div className="space-y-2 mb-4">
              {[
                { value: "spam", label: "Spam or duplicate" },
                { value: "fraud", label: "Fraud or scam" },
                { value: "inappropriate", label: "Inappropriate content" },
                { value: "misleading", label: "Misleading or false information" },
                { value: "illegal", label: "Illegal product or service" },
                { value: "other", label: "Other" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted">
                  <input
                    type="radio"
                    name="reportReason"
                    value={opt.value}
                    checked={reportReason === opt.value}
                    onChange={() => setReportReason(opt.value)}
                    className="accent-red-500"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Additional details (optional)..."
              className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 h-24 mb-4 resize-none"
              maxLength={500}
            />

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!reportReason) { alert("Please select a reason."); return; }
                  setReportSubmitting(true);
                  try {
                    const token = localStorage.getItem("auth_token");
                    const res = await fetch("/api/v1/reports", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        target_type: "listing",
                        target_id: parseInt(listingId),
                        reason: reportReason,
                        description: reportDescription,
                      }),
                    });
                    if (res.ok) {
                      alert("Report submitted. Thank you for helping keep Balkly safe.");
                      setShowReportModal(false);
                      setReportReason("");
                      setReportDescription("");
                    } else {
                      alert("Failed to submit report. Please try again.");
                    }
                  } catch {
                    alert("Failed to submit report. Please try again.");
                  } finally {
                    setReportSubmitting(false);
                  }
                }}
                disabled={reportSubmitting || !reportReason}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <button
                onClick={() => { setShowReportModal(false); setReportReason(""); setReportDescription(""); }}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Reports are reviewed by our team. For urgent legal matters: <a href="mailto:legal@balkly.live" className="text-red-500 hover:underline">legal@balkly.live</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

