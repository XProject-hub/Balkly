"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Trash2, Package, Calendar, MessageCircle } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      console.log('Favorites API response:', data);
      setFavorites(data.data || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await fetch(`/api/v1/favorites/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setFavorites(favorites.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('Listing')) return <Package className="h-5 w-5" />;
    if (type.includes('Event')) return <Calendar className="h-5 w-5" />;
    if (type.includes('Forum')) return <MessageCircle className="h-5 w-5" />;
    return <Heart className="h-5 w-5" />;
  };

  const getLink = (favorite: any) => {
    if (favorite.favoritable_type.includes('Listing')) {
      return `/listings/${favorite.favoritable_id}`;
    }
    if (favorite.favoritable_type.includes('Event')) {
      return `/events/${favorite.favoritable_id}`;
    }
    if (favorite.favoritable_type.includes('Forum')) {
      return `/forum/topics/${favorite.favoritable_id}`;
    }
    return '#';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
          <p className="text-lg opacity-90">Items you've saved</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No favorites yet</p>
              <Button asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card key={favorite.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                      {getIcon(favorite.favoritable_type)}
                    </div>
                    <div className="flex-1">
                      <Link href={getLink(favorite)}>
                        <h3 className="font-bold hover:text-primary transition-colors">
                          {favorite.favoritable?.title || favorite.favoritable?.name || 'Loading...'}
                        </h3>
                        {favorite.favoritable?.price && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            €{favorite.favoritable.price}
                          </p>
                        )}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Saved {new Date(favorite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(favorite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

