"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import MapboxMap from "./MapboxMap";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number;
  longitude: number;
};

const MapModal = ({ open, onOpenChange, latitude, longitude }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <MapboxMap latitude={latitude} longitude={longitude} />
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
