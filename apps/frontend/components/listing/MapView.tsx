"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  OverlayView,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { formatVietnamesePrice } from "@/utils";
import Link from "next/link";
import { Loader2, MapPin, X, Navigation } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  latitude?: number;
  longitude?: number;
  images?: { image_url: string }[];
  area?: number;
}

interface MapViewProps {
  listings: Listing[];
  markers?: Listing[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapResetKey?: number;
  onSearchRadiusChange?: (
    lat: number | undefined,
    lng: number | undefined,
    radius: number | undefined
  ) => void;
  onBoundsChange?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 21.0285,
  lng: 105.8542,
};

const STEP = 100; // 100m
const MIN = 0;
const MAX = 10000; // 10km

const libraries: "places"[] = ["places"];

export default function MapView({
  listings,
  markers,
  center,
  zoom,
  mapResetKey,
  onSearchRadiusChange,
  onBoundsChange,
}: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (center) {
      setMapCenter(center);
      if (map) map.panTo(center);
    }
  }, [center, map, mapResetKey]);

  useEffect(() => {
    if (zoom !== undefined) {
      setMapZoom(zoom);
      if (map) map.setZoom(zoom);
    }
  }, [zoom, map, mapResetKey]);

  // Radius Search States
  const [isRadiusActive, setIsRadiusActive] = useState(false);
  const [searchCenter, setSearchCenter] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [radius, setRadius] = useState([0]);
  const [showPopup, setShowPopup] = useState(false);

  // Cập nhật lng lat lên page cha khi thay đổi bán kính hoặc vị trí tìm kiếm
  useEffect(() => {
    if (onSearchRadiusChange) {
      if (isRadiusActive && searchCenter) {
        onSearchRadiusChange(searchCenter.lat, searchCenter.lng, radius[0]);
      } else {
        onSearchRadiusChange(undefined, undefined, undefined);
      }
    }
  }, [isRadiusActive, searchCenter, radius, onSearchRadiusChange]);

  // Sử dụng biến markers nếu có, nếu không thì dùng tạm listings
  const mapData = markers && markers.length > 0 ? markers : listings;
  const listingsWithCoords = mapData?.filter(
    (listing) => listing.latitude && listing.longitude
  );

  const handleMapIdle = () => {
    if (!map || !onBoundsChange) return;
    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    onBoundsChange({
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng(),
    });
  };

  const toggleRadiusSearch = () => {
    if (!isRadiusActive) {
      const center = map?.getCenter();
      if (center) {
        setSearchCenter({ lat: center.lat(), lng: center.lng() });
      } else {
        setSearchCenter(mapCenter);
      }
      setIsRadiusActive(true);
      setShowPopup(true);
    } else {
      setRadius([0]);
      setIsRadiusActive(false);
      setShowPopup(false);
      setSearchCenter(null);
    }
  };

  const formatPrice = (price: number) => {
    const millions = price / 1000000;
    return millions >= 1
      ? `${millions.toFixed(1)} tr`
      : `${(price / 1000).toFixed(0)}k`;
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Bản đồ đang tải...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Search Radius Button */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={toggleRadiusSearch}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg font-bold transition-all ${
            isRadiusActive
              ? "bg-primary text-white scale-105"
              : "bg-white text-text-main hover:bg-slate-50"
          }`}
        >
          <Navigation
            className={`w-4 h-4 ${isRadiusActive ? "animate-pulse" : ""}`}
          />
          <span>Đặt vị trí và khoảng cách tìm kiếm</span>
          {isRadiusActive && (
            <div
              className="ml-2 bg-white/20 p-0.5 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(!showPopup);
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}
        </button>

        {/* Radius Controls Popup */}
        {showPopup && searchCenter && (
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-slate-100 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-text-main">Thông số bán kính</h4>
              <button
                onClick={() => setShowPopup(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Vĩ độ (Lat)
                  </p>
                  <p className="text-sm font-mono text-text-main bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {searchCenter.lat.toFixed(6)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Kinh độ (Lng)
                  </p>
                  <p className="text-sm font-mono text-text-main bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {searchCenter.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Bán kính tìm kiếm
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {radius[0] >= 1000
                      ? `${(radius[0] / 1000).toFixed(1)} km`
                      : `${radius[0]} m`}
                  </p>
                </div>

                <div className="px-2 pt-2">
                  <Range
                    values={radius}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={(values) => setRadius(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: "36px",
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: "6px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                              values: radius,
                              colors: ["#3b82f6", "#e2e8f0"],
                              min: MIN,
                              max: MAX,
                            }),
                            alignSelf: "center",
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                    renderThumb={({ props }) => {
                      const { key, ...thumbProps } = props;
                      return (
                        <div
                          key={key}
                          {...thumbProps}
                          style={{
                            ...thumbProps.style,
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 6px #AAA",
                            outline: "none",
                          }}
                        >
                          <div
                            style={{
                              height: "10px",
                              width: "2px",
                              backgroundColor: "#3b82f6",
                            }}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        onLoad={(map) => setMap(map)}
        onIdle={handleMapIdle}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Search Radius Components */}
        {isRadiusActive && searchCenter && (
          <>
            <Circle
              center={searchCenter}
              radius={radius[0]}
              options={{
                fillColor: "#00FFFF",
                fillOpacity: 0.15,
                strokeColor: "#00CED1",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                clickable: false,
                zIndex: 1,
              }}
            />
            <Marker
              position={searchCenter}
              draggable={true}
              onDragEnd={(e) => {
                const newLat = e.latLng?.lat();
                const newLng = e.latLng?.lng();
                if (newLat && newLng) {
                  setSearchCenter({ lat: newLat, lng: newLng });
                }
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
                scale: 2,
                anchor: new google.maps.Point(12, 22),
              }}
            />
          </>
        )}

        {/* Group markers with same coordinates */}
        {Object.values(
          listingsWithCoords?.reduce((acc: any, listing) => {
            const key = `${listing.latitude}-${listing.longitude}`;
            if (!acc[key]) {
              acc[key] = {
                id: key,
                latitude: listing.latitude,
                longitude: listing.longitude,
                listings: [],
              };
            }
            acc[key].listings.push(listing);
            return acc;
          }, {}) || {}
        ).map((group: any) => {
          const isSelected =
            selectedListing &&
            selectedListing.latitude === group.latitude &&
            selectedListing.longitude === group.longitude;
          const count = group.listings.length;
          const firstListing = group.listings[0];

          return (
            <OverlayView
              key={group.id}
              position={{
                lat: group.latitude,
                lng: group.longitude,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="relative flex flex-col items-center">
                {isSelected && (
                  <div className="absolute bottom-full mb-4 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {group.listings.map((item: any, idx: number) => (
                        <Link
                          key={item.id}
                          target="_blank"
                          href={`/listing-detail/${item.id}`}
                          className={`flex gap-3 p-3 hover:bg-slate-50 transition-colors ${
                            idx !== group.listings.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          <div
                            className="h-16 w-20 shrink-0 rounded-lg bg-cover bg-center border border-slate-100"
                            style={{
                              backgroundImage: `url('${
                                item.images?.[0]?.image_url || "/placeholder.png"
                              }')`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-primary font-black text-sm mb-0.5">
                              {formatVietnamesePrice(item.price)}
                            </p>
                            <p className="text-slate-800 text-[11px] font-bold truncate">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {item.area && (
                                <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-medium">
                                  {item.area}m²
                                </span>
                              )}
                              <span className="text-[9px] text-slate-400 truncate">
                                {item.address?.split(",").slice(0, 2).join(",")}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
                  </div>
                )}

                {/* Price Pin */}
                <div
                  onClick={() =>
                    setSelectedListing(isSelected ? null : firstListing)
                  }
                  className={`${
                    isSelected
                      ? "bg-blue-800 text-white ring-2 ring-white scale-110 z-20"
                      : "bg-blue-600 hover:bg-blue-700 text-white z-10"
                  } font-bold text-xs px-2.5 py-1.5 rounded-full shadow-lg cursor-pointer transition-all relative whitespace-nowrap flex items-center gap-1.5`}
                >
                  {count > 1 ? (
                    <>
                      <div className="size-4 bg-white text-blue-800 rounded-full flex items-center justify-center text-[10px] font-black">
                        {count}
                      </div>
                      <span>Phòng ở đây</span>
                    </>
                  ) : (
                    formatPrice(firstListing.price)
                  )}
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${
                      isSelected ? "bg-blue-800" : "bg-blue-600"
                    } rotate-45 transition-colors group-hover:bg-blue-700`}
                  />
                </div>
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-0.5rem);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out, slide-in-from-bottom-4 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
