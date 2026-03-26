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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <SkeletonLoader type="nearby" count={6} />
        </div>
      </div>
    );
  }

  if (destinations.length === 0) return null;

  return (
    <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
          <Navigation size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">10 Tiện ích lân cận</h3>
          <p className="text-[11px] font-medium text-green-600 uppercase tracking-wider flex items-center gap-1">
            <MapIcon size={12} />
            Khoảng cách được tính toán theo đường trên không
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {destinations.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between py-2 border-b border-green-100 last:border-0 group transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="shrink-0 size-8 rounded-lg bg-white border border-green-100 flex items-center justify-center shadow-xs">
                {getDestinationIcon(item.type)}
              </div>
              <span className="text-sm font-bold text-slate-700 truncate group-hover:text-green-700 transition-colors">
                {item.name}
              </span>
            </div>
            <span className="shrink-0 text-xs font-black text-green-700 bg-white px-2 py-1 rounded-md border border-green-100 shadow-xs ml-4">
              {formatDistance(item.distance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
