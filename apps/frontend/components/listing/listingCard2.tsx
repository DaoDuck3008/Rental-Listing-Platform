import React from "react";

interface ListingCard2Props {
  title: string;
  imgUrl: string;
  cost: string | number;
  address: string;
  beds: number;
  baths: number;
  status?: string | null;
}

export default function ListingCard2({
  title,
  imgUrl,
  cost,
  address,
  beds,
  baths,
}: ListingCard2Props) {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 hover:-translate-y-1">
      <div
        className="w-full aspect-4/3 bg-cover bg-center rounded-xl overflow-hidden relative shadow-sm"
        style={{
          backgroundImage: `url('${imgUrl}')`,
        }}
      >
        <div className="w-full h-full bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        {/* You can add a badge here if needed, like in the original card */}
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-slate-900">
            {typeof cost === "number" ? cost.toLocaleString("vi-VN") : cost}
            <span className="text-sm font-normal text-slate-500">₫/tháng</span>
          </p>
          <div className="flex gap-1 text-xs text-slate-500 font-medium">
            <span>{beds} PN</span> • <span>{baths} WC</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 truncate" title={address}>
          {address}
        </p>
      </div>
    </div>
  );
}
