"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";

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
    currency: "EUR",
    city: "",
    country: "BA",
    images: [] as File[],
    attributes: {} as Record<string, string>,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Load categories on mount
  useState(() => {
    loadCategories();
  });

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
    setAiLoading(true);
    try {
      // Call AI helper endpoint
      const response = await fetch("/api/v1/ai/listing_helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: selectedCategory?.name,
        }),
      });
      const data = await response.json();
      
      // Update form with AI suggestions
      setFormData({
        ...formData,
        title: data.improved_title || formData.title,
        description: data.improved_description || formData.description,
      });
    } catch (error) {
      console.error("AI helper failed:", error);
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
      // Create listing
      const listingResponse = await listingsAPI.create({
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        city: formData.city,
        country: formData.country,
        attributes: formData.attributes,
      });

      const listingId = listingResponse.data.listing.id;

      // If a plan is selected, proceed to payment
      if (selectedPlan) {
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

        const orderData = await orderResponse.json();
        
        // Redirect to Stripe Checkout
        if (orderData.checkout_url) {
          window.location.href = orderData.checkout_url;
        }
      } else {
        // No plan selected, just save as draft
        router.push(`/dashboard/listings?created=${listingId}`);
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
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
                    onClick={() => setFormData({ ...formData, category_id: category.id })}
                    className={`p-6 border-2 rounded-lg transition-all hover:border-primary ${
                      formData.category_id === category.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="text-4xl mb-2">{category.icon || "📦"}</div>
                    <h3 className="font-bold">{category.name}</h3>
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
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., BMW M3 2020 - Excellent Condition"
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
                  {aiLoading ? "Improving with AI..." : "Improve with AI Helper"}
                </Button>

                <div>
                  <label className="block text-sm font-medium mb-2">Photos</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-2">
                      Drag & drop photos here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photos"
                    />
                    <label htmlFor="photos">
                      <Button variant="outline" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>
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
                          className="w-full px-4 py-2 border rounded-lg"
                        />
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
                      placeholder="e.g., Sarajevo"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="BA">Bosnia and Herzegovina</option>
                      <option value="HR">Croatia</option>
                      <option value="RS">Serbia</option>
                      <option value="ME">Montenegro</option>
                      <option value="SI">Slovenia</option>
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
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      step="0.01"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="EUR">EUR €</option>
                      <option value="USD">USD $</option>
                      <option value="BAM">BAM KM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Choose a Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              disabled={loading || !selectedPlan}
            >
              {loading ? "Processing..." : "Publish Listing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

