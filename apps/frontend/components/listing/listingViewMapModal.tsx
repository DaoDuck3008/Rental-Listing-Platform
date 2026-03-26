"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { X, Loader2 } from "lucide-react";

interface ListingViewMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: { lat: number; lng: number } | null;
  address: string;
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function ListingViewMapModal({
  isOpen,
  onClose,
  location,
  address,
}: ListingViewMapModalProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-text-main">Vị trí thực tế</h3>
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              {address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative min-h-[500px] flex items-center justify-center bg-slate-50">
          {!isLoaded ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-sm font-medium text-slate-500">
                Đang tải bản đồ...
              </p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={16}
              options={{
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              <Marker position={location} />
            </GoogleMap>
          )}
        </div>

        <div className="p-4 bg-white border-t border-border-color flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-8 h-11 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all transform active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
