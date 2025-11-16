"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { eventsAPI } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    type: "own",
    title: "",
    description: "",
    venue: "",
    address: "",
    city: "",
    country: "BA",
    start_at: "",
    end_at: "",
  });

  const [tickets, setTickets] = useState<any[]>([
    { name: "General Admission", description: "", price: "", capacity: "" },
  ]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.create(formData);
      const createdEventId = response.data.event.id;
      setEventId(createdEventId);
      handleNext();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTickets = async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      for (const ticket of tickets.filter((t) => t.name && t.price)) {
        await fetch(`/api/v1/events/${eventId}/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            name: ticket.name,
            description: ticket.description,
            price: parseFloat(ticket.price),
            capacity: ticket.capacity ? parseInt(ticket.capacity) : null,
          }),
        });
      }

      router.push(`/events/${eventId}?created=true`);
    } catch (error) {
      console.error("Failed to create tickets:", error);
      alert("Failed to create tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTicketType = () => {
    setTickets([...tickets, { name: "", description: "", price: "", capacity: "" }]);
  };

  const removeTicketType = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicket = (index: number, field: string, value: string) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const STEPS = [
    { id: 1, name: "Event Details", description: "Basic information" },
    { id: 2, name: "Location", description: "Venue and address" },
    { id: 3, name: "Tickets", description: "Ticket types and pricing" },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Event</h1>
          <p className="text-muted-foreground">
            Set up your event and start selling tickets
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
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
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="own">Balkly Ticketing (7.5% fee)</option>
                    <option value="affiliate">Affiliate/Partner Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Music Festival 2025"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    className="w-full px-4 py-2 border rounded-lg h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.start_at}
                      onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.end_at}
                      onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Venue Name *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g., City Arena"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Dubai"
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

            {/* Step 3: Tickets */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Ticket Types</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create different ticket types for your event (General, VIP, Early Bird, etc.)
                  </p>

                  <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <input
                                  type="text"
                                  value={ticket.name}
                                  onChange={(e) => updateTicket(index, "name", e.target.value)}
                                  placeholder="Ticket name (e.g., General Admission)"
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={ticket.description}
                                  onChange={(e) => updateTicket(index, "description", e.target.value)}
                                  placeholder="Description (optional)"
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="number"
                                  value={ticket.price}
                                  onChange={(e) => updateTicket(index, "price", e.target.value)}
                                  placeholder="Price (€)"
                                  className="px-3 py-2 border rounded-lg"
                                  step="0.01"
                                />
                                <input
                                  type="number"
                                  value={ticket.capacity}
                                  onChange={(e) => updateTicket(index, "capacity", e.target.value)}
                                  placeholder="Capacity (optional)"
                                  className="px-3 py-2 border rounded-lg"
                                />
                              </div>
                            </div>
                            {tickets.length > 1 && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeTicketType(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={addTicketType}
                    className="w-full mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Ticket Type
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Service Fee:</strong> 7.5% + €0.35 per ticket sold
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll receive payouts weekly to your connected account
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && currentStep < 3 && (
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {currentStep === 1 && (
            <Button
              onClick={handleNext}
              disabled={!formData.title || !formData.start_at}
              className="ml-auto"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              onClick={handleCreateEvent}
              disabled={loading || !formData.venue || !formData.city}
              className="ml-auto"
            >
              {loading ? "Creating..." : "Create Event & Add Tickets"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              onClick={handleCreateTickets}
              disabled={loading || tickets.every((t) => !t.name || !t.price)}
              className="ml-auto"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

