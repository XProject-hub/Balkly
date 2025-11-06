"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Send email via API
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully! We'll respond within 24 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We're here to help! Reach out to us through any channel below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-balkly-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      For general inquiries and support
                    </p>
                    <a
                      href="mailto:info@balkly.live"
                      className="text-balkly-blue hover:underline text-sm font-medium"
                    >
                      info@balkly.live
                    </a>
                    <br />
                    <a
                      href="mailto:support@balkly.live"
                      className="text-balkly-blue hover:underline text-sm font-medium"
                    >
                      support@balkly.live
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-teal-glow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                    <p className="text-sm text-gray-600">
                      Dubai, United Arab Emirates
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Serving the Balkan community across UAE
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-iris-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Chat with us in real-time
                    </p>
                    <Button
                      onClick={() => setShowChat(true)}
                      className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Live Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Send us a Message</CardTitle>
                <p className="text-sm text-gray-500">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-balkly-blue focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-balkly-blue focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-balkly-blue focus:border-transparent"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-balkly-blue focus:border-transparent"
                      placeholder="Tell us how we can assist you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white py-6 text-lg"
                  >
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      {showChat && (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <p className="font-bold">Balkly Support</p>
                <p className="text-xs opacity-90">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-white/20 rounded p-1"
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {/* Bot Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-balkly-blue flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                  <p className="text-sm text-gray-900">
                    👋 Hi! Welcome to Balkly Support. How can we help you today?
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    You can also email us at:{" "}
                    <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">
                      support@balkly.live
                    </a>
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick Help:</p>
                <button className="w-full text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm transition-colors">
                  📝 How do I post a listing?
                </button>
                <button className="w-full text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm transition-colors">
                  💳 Payment & Billing Questions
                </button>
                <button className="w-full text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm transition-colors">
                  🎫 Event Tickets Help
                </button>
                <button className="w-full text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm transition-colors">
                  🔒 Account & Security
                </button>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-balkly-blue focus:border-transparent text-sm"
              />
              <Button
                size="sm"
                className="bg-balkly-blue hover:bg-balkly-blue/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Or email:{" "}
              <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">
                support@balkly.live
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-balkly-blue to-iris-purple text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
