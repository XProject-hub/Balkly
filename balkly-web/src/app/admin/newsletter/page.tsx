"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Users, Trash2, Search, Loader2, Mail, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/lib/toast";

type Tab = "compose" | "subscribers" | "history";

export default function AdminNewsletterPage() {
  const [tab, setTab] = useState<Tab>("compose");
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    if (tab === "subscribers") loadSubscribers();
    if (tab === "history") loadHistory();
  }, [tab]);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/v1/admin/newsletter/subscribers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers?.data || []);
        setStats(data.stats || { total: 0, active: 0, inactive: 0 });
      }
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/newsletter/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data || []);
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Subject and content are required");
      return;
    }
    if (!confirm(`Send this newsletter to all active subscribers?\n\nSubject: ${subject}`)) return;

    setSending(true);
    try {
      const res = await fetch("/api/v1/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setSubject("");
        setContent("");
      } else {
        toast.error(data.message || "Failed to send");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/v1/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Subscriber removed");
        loadSubscribers();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Newsletter</h1>
          <p className="text-lg opacity-90">Compose and send newsletters, manage subscribers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
          {(["compose", "subscribers", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "compose" && <Send className="inline mr-2 h-4 w-4" />}
              {t === "subscribers" && <Users className="inline mr-2 h-4 w-4" />}
              {t === "history" && <Clock className="inline mr-2 h-4 w-4" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Compose Tab */}
        {tab === "compose" && (
          <div className="max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" /> Compose Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Weekly Update - New Features & Deals"
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content (HTML supported) *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your newsletter content here... HTML tags are supported."
                    rows={15}
                    className="w-full px-4 py-2 border rounded-lg bg-background font-mono text-sm"
                  />
                </div>

                {content && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <div className="border rounded-lg p-6 bg-white text-gray-900">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button onClick={handleSend} disabled={sending || !subject.trim() || !content.trim()} size="lg">
                    {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send to All Subscribers
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    This will send an email to all active subscribers.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscribers Tab */}
        {tab === "subscribers" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="py-4 text-center">
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
                  <p className="text-sm text-muted-foreground">Unsubscribed</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadSubscribers()}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <Button variant="outline" onClick={loadSubscribers}>Search</Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : subscribers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No subscribers yet</h3>
                  <p className="text-muted-foreground">Subscribers will appear here when people sign up.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Subscribed</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s: any) => (
                          <tr key={s.id} className="border-b last:border-0">
                            <td className="py-3 px-4 font-medium">{s.email}</td>
                            <td className="py-3 px-4 text-muted-foreground">{s.name || "-"}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                s.is_active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {s.is_active ? "Active" : "Unsubscribed"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(s.subscribed_at || s.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No newsletters sent yet</h3>
                  <p className="text-muted-foreground">Sent newsletters will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {history.map((n: any) => (
                  <Card key={n.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{n.subject}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sent to {n.recipients_count} subscriber{n.recipients_count !== 1 ? "s" : ""}
                            {" "}by {n.sent_by_user?.name || "Admin"}
                            {" "}on {new Date(n.sent_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                            Sent
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
