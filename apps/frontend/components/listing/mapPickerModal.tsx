"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number) => void;
  initialLocation: { lat: number; lng: number } | null;
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 21.028511,
  lng: 105.804817,
};

export default function MapPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation,
}: MapPickerModalProps) {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    defaultCenter
  );

  useEffect(() => {
    if (isOpen) {
      if (initialLocation) {
        setMarkerPosition(initialLocation);
        setCenter(initialLocation);
      } else {
        setMarkerPosition(null);
        setCenter(defaultCenter);
      }
    }
  }, [isOpen, initialLocation]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

  const handleConfirm = () => {
    if (markerPosition) {
      onSelectLocation(markerPosition.lat, markerPosition.lng);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-gray-50">
          <h3 className="text-xl font-bold text-text-main">
            Chọn vị trí chính xác trên bản đồ
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onClick={onMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    setMarkerPosition({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }
                }}
              />
            )}
          </GoogleMap>

          <div className="absolute top-4 left-4 right-4 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-text-main pointer-events-auto inline-block border border-primary/20">
              Nhấp vào bản đồ để đặt vị trí hoặc kéo Marker để điều chỉnh.
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-border-color flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 h-12 rounded-lg border border-input-border bg-white text-text-main font-bold hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!markerPosition}
            className="px-8 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận vị trí
          </button>
        </div>
      </div>
    </div>
  );
}
