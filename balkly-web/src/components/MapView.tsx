"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  listings: any[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapView({
  listings,
  center = [25.2048, 55.2708], // Dubai
  zoom = 12,
  height = "500px",
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom);

    // Add Google Maps tile layer with English language forced
    L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en&key=AIzaSyDLDCkbeHxOCWk8XLFaksOSOKOit4t2VQM", {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3'],
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: #0f172a;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          white-space: nowrap;
        ">
          <span style="margin-right: 4px;">📍</span>
          <span>€</span>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 30],
    });

    // Add markers for listings
    listings.forEach((listing) => {
      // Check for either location_geo or separate latitude/longitude
      let lat, lng;
      
      if (listing.location_geo) {
        [lat, lng] = listing.location_geo.split(",").map(parseFloat);
      } else if (listing.latitude && listing.longitude) {
        lat = parseFloat(listing.latitude);
        lng = parseFloat(listing.longitude);
      } else {
        return; // Skip if no location data
      }
      
      if (isNaN(lat) || isNaN(lng)) return;
      
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
              ${listing.title}
            </h3>
            ${
              listing.media?.[0]
                ? `<img src="${listing.media[0].url}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />`
                : ""
            }
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0f172a;">
              ${listing.currency === 'AED' ? 'د.إ' : '€'}${parseFloat(listing.price || 0).toLocaleString('de-DE', {minimumFractionDigits: 2}) || "Contact"}
            </p>
            <p style="margin: 4px 0 8px 0; font-size: 12px; color: #6b7280;">
              ${listing.city}
            </p>
            <a href="/listings/${listing.id}" style="
              display: inline-block;
              padding: 6px 12px;
              background: #0f172a;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            ">View Details</a>
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [listings, center, zoom]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ height, width: "100%", borderRadius: "8px" }} />
      <style jsx global>{`
        .leaflet-container {
          z-index: 0;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

