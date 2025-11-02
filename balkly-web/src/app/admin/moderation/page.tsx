"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Eye, Flag } from "lucide-react";

export default function ModerationQueuePage() {
  const [queue, setQueue] = useState([
    {
      id: 1,
      type: "listing",
      title: "BMW M3 2020",
      user: "John Seller",
      submitted: "2 hours ago",
      score: 0.92,
      flags: [],
    },
    {
      id: 2,
      type: "listing",
      title: "Apartment for Rent",
      user: "Jane Landlord",
      submitted: "5 hours ago",
      score: 0.45,
      flags: ["Suspicious content"],
    },
    {
      id: 3,
      type: "forum_post",
      title: "Looking to buy...",
      user: "Bob User",
      submitted: "1 day ago",
      score: 0.15,
      flags: ["Spam detected", "External links"],
    },
  ]);

  const handleApprove = (id: number) => {
    setQueue(queue.filter((item) => item.id !== id));
    alert("Item approved!");
  };

  const handleReject = (id: number) => {
    setQueue(queue.filter((item) => item.id !== id));
    alert("Item rejected!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Moderation Queue</h1>
          <p className="text-lg opacity-90">Review and approve content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {queue.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
              <p className="text-muted-foreground">
                No items pending moderation at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase">
                          {item.type.replace("_", " ")}
                        </span>
                        {item.score < 0.5 && (
                          <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full font-medium">
                            <Flag className="inline h-3 w-3 mr-1" />
                            HIGH RISK
                          </span>
                        )}
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {item.user} • {item.submitted}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Safety Score</p>
                      <p className="text-2xl font-bold">{(item.score * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.flags.length > 0 && (
                    <div className="mb-4 p-3 bg-destructive/10 rounded-lg">
                      <p className="font-medium text-sm mb-1">Automated Flags:</p>
                      <ul className="text-sm space-y-1">
                        {item.flags.map((flag, i) => (
                          <li key={i} className="text-destructive">• {flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`/listings/${item.id}`, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Content
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(item.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

