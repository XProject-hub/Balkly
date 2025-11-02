"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  ArrowLeft,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import { eventsAPI } from "@/lib/api";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getOne(eventId);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Failed to load event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketQuantity = (ticketId: number, change: number) => {
    const current = selectedTickets[ticketId] || 0;
    const newQuantity = Math.max(0, Math.min(10, current + change));
    
    setSelectedTickets({
      ...selectedTickets,
      [ticketId]: newQuantity,
    });
  };

  const calculateTotal = () => {
    if (!event?.tickets) return 0;
    
    return event.tickets.reduce((total: number, ticket: any) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    
    try {
      const ticketsArray = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
          ticket_id: parseInt(ticketId),
          quantity,
        }));

      if (ticketsArray.length === 0) {
        alert("Please select at least one ticket");
        setPurchasing(false);
        return;
      }

      const response = await fetch("/api/v1/orders/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          tickets: ticketsArray,
        }),
      });

      const data = await response.json();
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error("Failed to purchase tickets:", error);
      alert("Failed to purchase tickets. Please try again.");
    } finally {
      setPurchasing(false);
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

  if (!event) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => router.push("/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const totalTickets = Object.values(selectedTickets).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-96 bg-gradient-to-br from-primary/20 to-primary/5">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-32 w-32 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Button
              variant="secondary"
              size="sm"
              className="mb-4"
              onClick={() => router.push("/events")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-5xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex items-center gap-4 text-white/90 text-lg">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {new Date(event.start_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {new Date(event.start_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{event.description || "No description provided."}</p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        {event.venue}
                        {event.address && <><br />{event.address}</>}
                        <br />{event.city}, {event.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-muted-foreground">
                        {new Date(event.start_at).toLocaleString()}
                        {event.end_at && (
                          <> - {new Date(event.end_at).toLocaleString()}</>
                        )}
                      </p>
                    </div>
                  </div>

                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Organized by</p>
                        <p className="text-muted-foreground">{event.organizer.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tickets Section (for own events) */}
            {event.type === "own" && event.tickets && event.tickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.tickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{ticket.name}</h3>
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground">
                            {ticket.description}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-primary mt-2">
                          €{ticket.price.toFixed(2)}
                        </p>
                        {ticket.capacity && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {ticket.capacity - ticket.sold} / {ticket.capacity} available
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleTicketQuantity(ticket.id, -1)}
                          disabled={!selectedTickets[ticket.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-8 text-center">
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleTicketQuantity(ticket.id, 1)}
                          disabled={
                            (selectedTickets[ticket.id] || 0) >= 10 ||
                            (ticket.capacity && ticket.sold >= ticket.capacity)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Card */}
            {event.type === "own" && event.tickets && event.tickets.length > 0 ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>
                    <Ticket className="inline h-5 w-5 mr-2" />
                    Get Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {totalTickets > 0 ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{totalTickets} ticket(s)</span>
                          <span className="font-medium">€{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">
                            €{(calculateTotal() * 1.075).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Includes 7.5% service fee + €0.35 per ticket
                        </p>
                      </div>
                      
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePurchase}
                        disabled={purchasing}
                      >
                        {purchasing ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select tickets above to continue</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : event.type === "affiliate" && event.partner_url ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Partner Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This event is hosted by our partner. You'll be redirected to their site to purchase tickets.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <a href={event.partner_url} target="_blank" rel="noopener noreferrer">
                      Get Tickets on Partner Site
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Share Card */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }
                }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

