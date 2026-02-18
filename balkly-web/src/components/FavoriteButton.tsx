"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  type: string;
  id: number;
  size?: "sm" | "default" | "lg";
}

export default function FavoriteButton({ type, id, size = "default" }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [type, id]);

  const checkFavorite = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      const response = await fetch("/api/v1/favorites/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          favoritable_type: type,
          favoritable_id: id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.is_favorited);
        if (data.favorite_id) setFavoriteRecordId(data.favorite_id);
      }
    } catch (error) {
      // User not logged in or error
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to save favorites");
      return;
    }
    setLoading(true);
    try {
      if (isFavorited && favoriteRecordId) {
        await fetch(`/api/v1/favorites/${favoriteRecordId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorited(false);
        setFavoriteRecordId(null);
      } else {
        const response = await fetch("/api/v1/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            favoritable_type: type,
            favoritable_id: id,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(true);
          if (data.favorite?.id) setFavoriteRecordId(data.favorite.id);
        }
      }
    } catch (error) {
      alert("Please login to save favorites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={isFavorited ? "default" : "outline"}
      onClick={toggleFavorite}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
    </Button>
  );
}

