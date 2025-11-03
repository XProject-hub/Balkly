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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [type, id]);

  const checkFavorite = async () => {
    try {
      const response = await fetch("/api/v1/favorites/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          favoritable_type: type,
          favoritable_id: id,
        }),
      });
      const data = await response.json();
      setIsFavorited(data.is_favorited);
    } catch (error) {
      // User not logged in or error
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        await fetch(`/api/v1/favorites/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        setIsFavorited(false);
      } else {
        // Add to favorites
        await fetch("/api/v1/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            favoritable_type: type,
            favoritable_id: id,
          }),
        });
        setIsFavorited(true);
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

