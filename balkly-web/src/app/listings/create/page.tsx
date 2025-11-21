"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  Car,
  Home,
  Calendar,
  Smartphone,
  Shirt,
  Sofa,
  Dumbbell,
  Briefcase,
  Wrench,
  Package,
} from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    'car': Car,
    'home': Home,
    'calendar': Calendar,
    'smartphone': Smartphone,
    'shirt': Shirt,
    'sofa': Sofa,
    'dumbbell': Dumbbell,
    'briefcase': Briefcase,
    'wrench': Wrench,
    'package': Package,
  };
  
  const IconComponent = icons[iconName?.toLowerCase()] || Package;
  return <IconComponent className="h-16 w-16 mx-auto" />;
};

// Multi-step wizard steps
const STEPS = [
  { id: 1, name: "Category", description: "Choose your listing category" },
  { id: 2, name: "Details", description: "Add title, description, and photos" },
  { id: 3, name: "Attributes", description: "Specify item details" },
  { id: 4, name: "Pricing", description: "Set price and select a plan" },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    currency: "AED",
    city: "",
    country: "AE",
    images: [] as File[],
    attributes: {} as Record<string, string>,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadCategoryAttributes = async (categoryId: string) => {
    try {
      const response = await categoriesAPI.getAttributes(categoryId);
      setSelectedCategory(response.data.category);
      // Load plans for this category (mock for now)
      setPlans([
        { id: 1, name: "Standard", price: 4.99, duration_days: 30 },
        { id: 2, name: "Featured", price: 14.99, duration_days: 30 },
        { id: 3, name: "Boost", price: 4.99, duration_days: 7 },
      ]);
    } catch (error) {
      console.error("Failed to load category:", error);
    }
  };

  const handleAIHelper = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter both title and description first!");
      return;
    }

    setAiLoading(true);
    try {
      // Call AI helper endpoint
      const response = await fetch("/api/v1/ai/listing_helper", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: selectedCategory?.name,
          locale: "en", // Force English for AI
        }),
      });

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await response.json();
      
      // Update form with AI suggestions
      const titleChanged = data.improved_title && data.improved_title !== formData.title;
      const descChanged = data.improved_description && data.improved_description !== formData.description;
      
      if (titleChanged || descChanged) {
        setFormData({
          ...formData,
          title: data.improved_title || formData.title,
          description: data.improved_description || formData.description,
        });
        alert("✨ Listing enhanced with AI suggestions! Check the updated title and description.");
      } else {
        alert("AI is not configured or didn't suggest changes. Your listing looks good as-is!");
      }
    } catch (error: any) {
      console.error("AI helper failed:", error);
      alert("AI enhancement is currently unavailable. Your listing will be saved as-is.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && formData.category_id) {
      await loadCategoryAttributes(formData.category_id);
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Creating listing with data:", formData);
      
      // Create listing
      const listingResponse = await listingsAPI.create({
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        city: formData.city,
        country: formData.country,
        attributes: formData.attributes,
      });

      console.log("Listing response:", listingResponse.data);

      if (!listingResponse.data || !listingResponse.data.listing) {
        throw new Error("Invalid response from server");
      }

      const listingId = listingResponse.data.listing.id;
      console.log("Listing created with ID:", listingId);

      // Upload images if any
      if (formData.images.length > 0) {
        console.log("Uploading", formData.images.length, "images...");
        const imageFormData = new FormData();
        
        formData.images.forEach((file, index) => {
          imageFormData.append('images[]', file);
        });

        try {
          const uploadResponse = await fetch(`/api/v1/listings/${listingId}/media`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: imageFormData,
          });
          
          console.log("Upload response status:", uploadResponse.status);
          const uploadData = await uploadResponse.json();
          console.log("Upload response data:", uploadData);
          
          if (uploadResponse.ok) {
            console.log("✅ Images uploaded successfully:", uploadData.media?.length, "images");
          } else {
            console.error("❌ Image upload failed:", uploadData);
            alert("Images failed to upload: " + (uploadData.message || "Unknown error"));
          }
        } catch (error) {
          console.error("Failed to upload images:", error);
          alert("Image upload error! Check console.");
        }
      }

      // If a plan is selected, proceed to payment
      if (selectedPlan) {
        console.log("Creating order for listing:", listingId, "with plan:", selectedPlan.id);
        
        try {
          const orderResponse = await fetch("/api/v1/orders/listings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({
              listing_id: listingId,
              plan_id: selectedPlan.id,
            }),
          });

          console.log("Order response status:", orderResponse.status);

          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            console.log("Order data:", orderData);
            
            // Redirect to Stripe Checkout
            if (orderData.checkout_url) {
              window.location.href = orderData.checkout_url;
            } else {
              alert("Payment processing error. Listing created but not promoted.");
              window.location.href = `/dashboard/listings`;
            }
          } else {
            const errorData = await orderResponse.json();
            console.error("Order failed:", errorData);
            alert("Payment setup failed: " + (errorData.message || "Unknown error"));
            // Listing is created, redirect anyway
            window.location.href = `/dashboard/listings`;
          }
        } catch (orderError) {
          console.error("Order error:", orderError);
          alert("Payment setup error. Listing created without promotion.");
          window.location.href = `/dashboard/listings`;
        }
      } else {
        // No plan selected, listing is already active
        alert("✅ Listing created successfully! View it in My Listings.");
        window.location.href = `/dashboard/listings`;
      }
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.errors ||
                      error.message || 
                      "Failed to create listing. Please check all required fields.";
      
      // Format error message
      if (typeof errorMsg === 'object') {
        const errors = Object.entries(errorMsg).map(([field, msgs]) => 
          `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
        ).join('\n');
        alert(`Validation errors:\n${errors}`);
      } else {
        alert(`Error creating listing:\n${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Listing</h1>
          <p className="text-muted-foreground">
            List your item in just a few steps. AI will help you create the perfect listing.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setFormData({ ...formData, category_id: category.id });
                      setSelectedCategory(category);
                    }}
                    className={`p-6 border-2 rounded-lg transition-all hover:border-primary hover:shadow-lg ${
                      formData.category_id === category.id
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border"
                    }`}
                  >
                    <div className="mb-4 text-primary">
                      {getIconComponent(category.icon)}
                    </div>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Title, Description, Photos */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Show Selected Category - Prominent Banner */}
                {selectedCategory && (
                  <div className="p-5 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-lg border-2 border-primary/30 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                        {getIconComponent(selectedCategory.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Category Selected:</p>
                        <p className="font-bold text-xl text-primary dark:text-primary-foreground">{selectedCategory.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{selectedCategory.description}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={
                      selectedCategory?.slug === 'auto' ? 'e.g., BMW M3 2020 - Excellent Condition' :
                      selectedCategory?.slug === 'nekretnine' ? 'e.g., 2 Bedroom Apartment in JVC' :
                      selectedCategory?.slug === 'electronics' ? 'e.g., iPhone 15 Pro Max 256GB' :
                      selectedCategory?.slug === 'fashion' ? 'e.g., Nike Air Jordan Retro 1' :
                      selectedCategory?.slug === 'home' ? 'e.g., IKEA Sofa Bed - Like New' :
                      selectedCategory?.slug === 'sports' ? 'e.g., Mountain Bike 27.5" - Shimano' :
                      'e.g., Describe your item briefly'
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item in detail..."
                    className="w-full px-4 py-2 border rounded-lg h-32"
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <Button
                  onClick={handleAIHelper}
                  disabled={aiLoading || !formData.title}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {aiLoading ? "Enhancing..." : "Auto-Enhance Listing"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Improve your title and description automatically
                </p>

                <div>
                  <label className="block text-sm font-medium mb-2">Photos & Videos</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <p className="text-muted-foreground mb-2">
                      Drag & drop photos and videos here
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Max 10 files • Images: JPG, PNG, WebP • Videos: MP4, MOV
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
                      className="hidden"
                      id="photos"
                      onChange={(e) => {
                        if (e.target.files) {
                          const filesArray = Array.from(e.target.files);
                          setFormData({ ...formData, images: filesArray });
                        }
                      }}
                    />
                    <label htmlFor="photos">
                      <Button variant="outline" type="button" asChild>
                        <span>Choose Files ({formData.images.length}/10)</span>
                      </Button>
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                              COVER
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Attributes */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory?.attributes?.map((attr: any) => (
                    <div key={attr.id}>
                      <label className="block text-sm font-medium mb-2">
                        {attr.name} {attr.is_required && "*"}
                      </label>
                      {attr.type === "select" ? (
                        <select
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                [attr.id]: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">Select...</option>
                          {attr.options_json?.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={attr.type === "number" ? "number" : "text"}
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                [attr.id]: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                          // Special validation for Year field
                          {...(attr.slug === 'year' && {
                            min: 1950,
                            max: new Date().getFullYear() + 1,
                            placeholder: `e.g., ${new Date().getFullYear() - 3}`,
                            onInput: (e: any) => {
                              const val = parseInt(e.target.value);
                              if (val < 1950) e.target.value = '1950';
                              if (val > new Date().getFullYear() + 1) e.target.value = String(new Date().getFullYear() + 1);
                            }
                          })}
                        />
                      )}
                      {attr.slug === 'year' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Valid range: 1950 - {new Date().getFullYear() + 1}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Dubai"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="AE">🇦🇪 United Arab Emirates</option>
                      <option value="BA">🇧🇦 Bosnia and Herzegovina</option>
                      <option value="HR">🇭🇷 Croatia</option>
                      <option value="RS">🇷🇸 Serbia</option>
                      <option value="ME">🇲🇪 Montenegro</option>
                      <option value="SI">🇸🇮 Slovenia</option>
                      <option value="MK">🇲🇰 North Macedonia</option>
                      <option value="AL">🇦🇱 Albania</option>
                      <option value="XK">🇽🇰 Kosovo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Pricing & Plan Selection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.price ? parseFloat(formData.price.replace(/\./g, '').replace(',', '.')).toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ''}
                      onChange={(e) => {
                        // Remove formatting, keep only numbers and one comma/dot
                        const raw = e.target.value.replace(/[^\d,]/g, '').replace(',', '.');
                        setFormData({ ...formData, price: raw });
                      }}
                      placeholder="0,00"
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="AED">AED د.إ</option>
                      <option value="EUR">EUR €</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Choose a Plan (Optional)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Boost your listing visibility with a premium plan, or continue with basic free listing.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        selectedPlan === null
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-2">Free Listing</h4>
                      <p className="text-3xl font-bold text-primary mb-2">
                        FREE
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Basic listing visibility
                      </p>
                    </button>
                    
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 border-2 rounded-lg transition-all ${
                          selectedPlan?.id === plan.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                        <p className="text-3xl font-bold text-primary mb-2">
                          €{plan.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plan.duration_days} days
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={
                loading ||
                (currentStep === 1 && !formData.category_id) ||
                (currentStep === 2 && (!formData.title || !formData.description))
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Publish Listing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

