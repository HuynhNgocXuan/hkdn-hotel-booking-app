"use client";

import { Suspense } from "react";
import LocationFilter from "./LocationFilter";

const LocationFilterClient = () => {
  return (
    <Suspense fallback={<div>Loading bookings...</div>}>
      <LocationFilter />
    </Suspense>
  );
};

export default LocationFilterClient;
