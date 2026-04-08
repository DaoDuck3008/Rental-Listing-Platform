"use client";

import { useEffect, useState } from "react";
import { getNearbyDestinations } from "@/services/listing.api";
import { 
  MapPin, 
  Navigation, 
  Map as MapIcon, 
  University, 
  Building2, 
  Hotel, 
  Trees 
} from "lucide-react";
import SkeletonLoader from "../common/skeletonLoader";

interface Destination {
  id: string;
  name: string;
  type: string;
  distance: number;
}

const getDestinationIcon = (type: string) => {
  switch (type) {
    case "UNIVERSITY":
      return <University className="text-green-600" size={18} />;
    case "MALL":
      return <Building2 className="text-green-600" size={18} />;
    case "HOSPITAL":
      return <Hotel className="text-green-600" size={18} />;
    case "PARK":
      return <Trees className="text-green-600" size={18} />;
    default:
      return <MapPin className="text-green-600" size={18} />;
  }
};

const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export default function NearbyDestinations({ listingId }: { listingId: string }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await getNearbyDestinations(listingId);
        if (res.success) {
          setDestinations(res.data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching nearby destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchDestinations();
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SkeletonLoader type="rect" className="size-10 rounded-full bg-green-100" />
          <div className="space-y-2">
            <SkeletonLoader type="text" className="w-48 bg-green-200" />
            <SkeletonLoader type="text" className="w-32 bg-green-100 h-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-x-8 md:gap-y-4">
          <SkeletonLoader type="nearby" count={6} />
        </div>
      </div>
    );
  }

  if (destinations.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-green-100 text-green-700 sm:size-10">
          <Navigation size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">10 Tiện ích lân cận</h3>
          <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-green-600 sm:text-[11px]">
            <MapIcon size={12} />
            Khoảng cách được tính toán theo đường trên không
          </p>
        </div>
      </div>

      <div className="grid max-h-72 grid-cols-2 gap-x-3 gap-y-2.5 overflow-y-auto pr-1 sm:max-h-80 sm:gap-x-6 sm:gap-y-3">
        {destinations.map((item) => (
          <div 
            key={item.id} 
            className="group flex items-center justify-between border-b border-green-100 py-1.5 transition-all last:border-0 sm:py-2"
          >
            <div className="flex items-center gap-2 overflow-hidden sm:gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-green-100 bg-white shadow-xs sm:size-8">
                {getDestinationIcon(item.type)}
              </div>
              <span className="truncate text-xs font-bold text-slate-700 transition-colors group-hover:text-green-700 sm:text-sm">
                {item.name}
              </span>
            </div>
            <span className="ml-2 shrink-0 rounded-md border border-green-100 bg-white px-1.5 py-1 text-[10px] font-black text-green-700 shadow-xs sm:ml-3 sm:px-2 sm:text-xs">
              {formatDistance(item.distance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
