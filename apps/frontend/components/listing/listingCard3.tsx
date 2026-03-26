import React from "react";
import { MapPin, Bed, Bath, Eye, Heart, Square } from "lucide-react";
import Link from "next/link";
import { formatVietnamesePrice, formatViews } from "@/utils/formatters";
import { useFavorites } from "@/hooks/useFavorites";

interface ListingCard3Props {
  id: string;
  title: string;
  address: string;
  price: number | string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  views: number;
  listing_type_name: string;
  image_url: string;
}

export default function ListingCard3({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  views,
  listing_type_name,
  image_url,
}: ListingCard3Props) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="group flex flex-col sm:flex-row gap-3 rounded-xl mt-2 bg-white p-3 shadow-sm hover:shadow-lg border border-transparent hover:border-primary/30 transition-all cursor-pointer relative">
      <Link
        target="_blank"
        href={`/listing-detail/${id}`}
        className="absolute inset-0 z-0"
        aria-label={`View details of ${title}`}
      />

      {/* Image */}
      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 rounded-lg overflow-hidden z-10">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url('${image_url || "/placeholder.png"}')`,
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {listing_type_name}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between py-1 z-10 pointer-events-none">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-text-main text-base font-bold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h4>
          </div>
          <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {address}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-slate-600">
            {area > 0 && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                <Square className="w-3 h-3" />
                {area} m²
              </span>
            )}
            {bedrooms > 0 && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                <Bed className="w-3 h-3" />
                {bedrooms} PN
              </span>
            )}
            {bathrooms > 0 && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                <Bath className="w-3 h-3" />
                {bathrooms} WC
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex gap-2">
            <p className="text-primary text-md font-extrabold leading-tight">
              {formatVietnamesePrice(Number(price || 0))}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-text-secondary">
              <Eye className="w-3 h-3" />
              <span>{formatViews(views)} lượt xem</span>
            </div>
          </div>

          <button
            type="button"
            className={`p-2 rounded-full transition-all pointer-events-auto shadow-sm ${
              isFavorite
                ? "bg-red-50 text-red-500"
                : "bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50"
            }`}
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
