"use client";

import { useEffect, useState } from "react";
import ListingCard from "./listingCard";
import { getRelatedListings } from "@/services/listing.api";
import { Skeleton } from "../common/skeletonLoader";

interface RelatedListingsProps {
  listingId: string;
}

export default function RelatedListings({ listingId }: RelatedListingsProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await getRelatedListings(listingId);
        if (res.success) {
          setListings(res.data);
        }
      } catch (error) {
        console.error("Error fetching related listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchRelated();
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="mt-16 mb-10 flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-95 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <div className="mt-16 mb-10 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
        Bài đăng tương tự
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            address={item.address}
            imgUrl={item.images?.[0]?.image_url || "/HomePage/Listing1.png"}
            beds={item.bedrooms}
            baths={item.bathrooms}
            status={item.status}
            area={item.area}
          />
        ))}
      </div>
    </div>
  );
}
