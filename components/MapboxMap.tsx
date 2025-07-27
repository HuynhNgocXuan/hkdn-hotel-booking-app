"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Props = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

const MapboxMap = ({ latitude, longitude, zoom = 13 }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom,
    });

    map.on("load", () => {
      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    });

    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] md:h-[400px] rounded-xl overflow-hidden border border-gray-300"
      />
    </div>
  );
};

export default MapboxMap;
