"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { PropertyItem } from "../lib/fastled_engine";

interface GisMapProps {
  properties: PropertyItem[];
  onSelectProperty: (property: PropertyItem) => void;
}

export default function GisMap({ properties, onSelectProperty }: GisMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([16.4322, 103.5061], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors | กาฬสินธุ์ Real Estate GIS"
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    properties.slice(0, 150).forEach((item) => {
      const iconColor =
        item.type === "led_asset" ? "#d97706" : item.type === "wooden_building" ? "#8b5a2b" : "#0284c7";

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${iconColor}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 180px; font-size: 12px;">
          <b style="font-size: 13px;">${item.title}</b><br/>
          <span style="color: #64748b;">อ.${item.district} ต.${item.subdistrict}</span><br/>
          <span style="color: #ea580c; font-weight: bold; font-size: 14px;">฿${item.priceStarting.toLocaleString()} บาท</span>
        </div>
      `);

      marker.on("click", () => {
        onSelectProperty(item);
      });

      markersRef.current.push(marker);
    });
  }, [properties, onSelectProperty]);

  return (
    <div className="w-full h-[550px] rounded-2xl overflow-hidden shadow border border-slate-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
