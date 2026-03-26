import { Bath, Bed, Heart, LandPlot } from "lucide-react";
import { formatVietnamesePrice } from "@/utils/formatters";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";

interface ListingCardProps {
  id: string;
  title: string;
  imgUrl: string;
  price: number | string;
  address: string;
  beds: number;
  baths: number;
  area: number;
  status: string | null;
}

export default function ListingCard({
  id,
  title,
  imgUrl,
  price,
  address,
  beds,
  baths,
  area,
  status,
}: ListingCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Link
      href={`/listing-detail/${id}`}
      className="group bg-white cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105">
          <img
            src={imgUrl ?? "./NoImage.jpg"}
            className="w-full h-full object-cover"
            alt={title}
          />
        </div>
        <div className="absolute top-2.5 right-2.5 z-20">
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full transition-all backdrop-blur-sm shadow-sm ${
              isFavorite
                ? "bg-red-50 text-red-500"
                : "bg-white/90 text-slate-400 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>
        {/* <div className="absolute top-2.5 left-2.5">
          <span className="bg-primary/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            Mới
          </span>
        </div> */}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold text-primary">
            {formatVietnamesePrice(Number(price || 0))}
          </h3>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
            Đã xác thực
          </span>
        </div>
        <p className="text-slate-900 font-semibold text-sm truncate">{title}</p>
        <p className="text-slate-500 text-[13px] truncate">{address}</p>
        <div className="w-full h-px bg-slate-100 my-1"></div>
        <div className="flex items-center gap-3 text-slate-600 text-[13px]">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-400" />
            <span className="font-bold">{beds}</span> PN
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-slate-400" />
            <span className="font-bold">{baths}</span> PT
          </div>
          <div className="flex items-center gap-1">
            <LandPlot className="w-4 h-4 text-slate-400" />
            <span className="font-bold">{area.toLocaleString("vi-VN")}</span> m²
          </div>
        </div>
      </div>
    </Link>
  );
}
