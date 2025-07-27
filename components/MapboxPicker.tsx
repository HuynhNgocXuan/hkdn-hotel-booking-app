"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import debounce from "lodash.debounce";
import MapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Props = {
  address: string;
  onLocationSelect: (lat: number, lng: number) => void;
};

const MapboxPicker = ({ address, onLocationSelect }: Props) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [lat, setLat] = useState(10.762622); 
  const [lng, setLng] = useState(106.660172);
  const [zoom, setZoom] = useState(14);
  const [error, setError] = useState("");

  if (!mapboxgl.accessToken) {
    throw new Error("Mapbox access token is not defined.");
  }
  const geocodingClient = MapboxGeocoding({
    accessToken: mapboxgl.accessToken as string,
  });

  const geocodeAddress = debounce(async (address: string) => {
    if (!address) return;

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: address,
          limit: 1,
        })
        .send();

      const match = response.body.features[0];
      if (match) {
        const [lng, lat] = match.geometry.coordinates;
        setLat(lat);
        setLng(lng);
        setError("");
        onLocationSelect(lat, lng);

        if (mapRef.current) mapRef.current.setCenter([lng, lat]);
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

          markerRef.current.on("dragend", () => {
            const lngLat = markerRef.current!.getLngLat();
            setLat(lngLat.lat);
            setLng(lngLat.lng);
            onLocationSelect(lngLat.lat, lngLat.lng);
          });
        }
      } else {
        setError("⚠️ Địa chỉ không hợp lệ hoặc không tìm thấy trên bản đồ.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("⚠️ Lỗi khi truy vấn địa chỉ.");
    }
  }, 800);

  useEffect(() => {
    geocodeAddress(address);
  }, [address]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom,
      bearing: 180,
      pitch: 25,
    });

    mapRef.current.on("zoomend", () => {
      if (!mapRef.current) return;
      setZoom(mapRef.current.getZoom());
    });

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setLat(lat);
      setLng(lng);
      onLocationSelect(lat, lng);

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);

        markerRef.current.on("dragend", () => {
          const lngLat = markerRef.current!.getLngLat();
          setLat(lngLat.lat);
          setLng(lngLat.lng);
          onLocationSelect(lngLat.lat, lngLat.lng);
        });
      }
    });
  }, []);

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-500 italic">{error}</p>}
      <div
        ref={mapContainerRef}
        className="rounded-lg border shadow-md w-full h-[400px]"
      />
      <div className="text-sm text-muted-foreground italic">
        🎯 Bạn có thể click hoặc kéo bản đồ để chỉnh vị trí chính xác.
      </div>
    </div>
  );
};

export default MapboxPicker;
