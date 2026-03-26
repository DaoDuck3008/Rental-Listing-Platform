"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  Share2,
  Heart,
} from "lucide-react";

interface ListingGalleryProps {
  images: string[];
}

export default function ListingGallery({
  images: initialImages,
}: ListingGalleryProps) {
  const images =
    initialImages.length > 0
      ? initialImages
      : [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
        ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      {/* Top Actions Overlay (Standard on luxury listing sites) */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-text-main hover:bg-white transition-all">
          <Share2 size={14} />
          Chia sẻ
        </button>
        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-text-main hover:bg-white transition-all">
          <Heart size={14} />
          Lưu
        </button>
      </div>

      {/* Gallery Grid - Airbnb Style */}
      <div
        className={`grid gap-2 h-87.5 md:h-125 rounded-2xl overflow-hidden shadow-2xl relative group ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
            ? "grid-cols-2"
            : "grid-cols-4 grid-rows-2"
        }`}
      >
        {/* Main large image */}
        <div
          className={`relative cursor-pointer overflow-hidden ${
            images.length === 1
              ? "col-span-1"
              : images.length === 2
              ? "col-span-1"
              : "col-span-4 md:col-span-2 row-span-2"
          }`}
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt="Main listing view"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Smaller images (only visible if available and on desktop) */}
        {images.length >= 2 && (
          <div
            className={`relative cursor-pointer overflow-hidden border-white ${
              images.length === 2
                ? "col-span-1 border-l-2"
                : "hidden md:block col-span-1 border-l-2"
            }`}
            onClick={() => openModal(1)}
          >
            <Image
              src={images[1]}
              alt="Interior 1"
              fill
              className="object-cover hover:brightness-90 transition-all duration-300"
              sizes="25vw"
            />
          </div>
        )}

        {images.length >= 3 && (
          <div
            className="hidden md:block relative cursor-pointer overflow-hidden border-l-2 border-white"
            onClick={() => openModal(2)}
          >
            <Image
              src={images[2]}
              alt="Interior 2"
              fill
              className="object-cover hover:brightness-90 transition-all duration-300"
              sizes="25vw"
            />
          </div>
        )}

        {images.length >= 4 && (
          <div
            className="hidden md:block relative cursor-pointer overflow-hidden border-t-2 border-l-2 border-white"
            onClick={() => openModal(3)}
          >
            <Image
              src={images[3]}
              alt="Interior 3"
              fill
              className="object-cover hover:brightness-90 transition-all duration-300"
              sizes="25vw"
            />
          </div>
        )}

        {/* See all photos button */}
        <button
          onClick={() => openModal(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-text-main px-4 py-2 rounded-lg shadow-xl text-sm font-bold text-text-main hover:bg-gray-50 transition-all transform active:scale-95 z-10"
        >
          <Grid size={16} />
          {images.length > 4
            ? `Xem tất cả ${images.length} hình ảnh`
            : "Xem tất cả hình ảnh"}
        </button>
      </div>

      {/* Lightbox / Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center animate-in fade-in duration-300 select-none"
          onClick={closeModal}
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent z-110">
            <div className="text-white bg-black/40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="p-2.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all hover:rotate-90 duration-300 backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Large Image Slider */}
          <div className="relative w-full h-[70vh] flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-6xl h-full transition-all duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex]}
                alt={`Detail photo ${currentIndex + 1}`}
                fill
                className="object-contain animate-in zoom-in-95 duration-500"
                quality={100}
                priority
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/30 transition-all z-110 backdrop-blur-sm border border-white/20 group"
            >
              <ChevronLeft
                size={36}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/30 transition-all z-110 backdrop-blur-sm border border-white/20 group"
            >
              <ChevronRight
                size={36}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Bottom Thumbnails Navigation */}
          <div
            className="absolute bottom-6 flex gap-3 px-4 py-4 max-w-full overflow-x-auto scrollbar-hide bg-black/40 backdrop-blur-md rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ring-2 ring-transparent ${
                  currentIndex === idx
                    ? "border-primary scale-110 shadow-[0_0_15px_rgba(19,127,236,0.5)] ring-primary/20"
                    : "border-transparent opacity-40 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
