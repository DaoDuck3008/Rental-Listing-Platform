"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ListingCard from "./listingCard";
import { getRelatedListings } from "@/services/listing.api";
import { Skeleton } from "../common/skeletonLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedListingsProps {
  listingId: string;
}

export default function RelatedListings({ listingId }: RelatedListingsProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);

  const listingSlides = useMemo(() => {
    const chunkSize = 4;
    const chunks: any[][] = [];
    for (let i = 0; i < listings.length; i += chunkSize) {
      chunks.push(listings.slice(i, i + chunkSize));
    }
    return chunks;
  }, [listings]);

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

  useEffect(() => {
    if (listingSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % listingSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [listingSlides.length]);

  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider || listings.length <= 1) return;

    let intervalId: number | null = null;
    let resumeTimeout: number | null = null;

    const startAutoScroll = () => {
      intervalId = window.setInterval(() => {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        if (maxScrollLeft <= 0) return;

        if (slider.scrollLeft >= maxScrollLeft - 1) {
          slider.scrollTo({ left: 0, behavior: "auto" });
          return;
        }

        slider.scrollBy({ left: 1, behavior: "auto" });
      }, 28);
    };

    const stopAutoScroll = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const resumeAutoScroll = () => {
      if (resumeTimeout !== null) window.clearTimeout(resumeTimeout);
      resumeTimeout = window.setTimeout(() => {
        if (intervalId === null) startAutoScroll();
      }, 1500);
    };

    startAutoScroll();

    slider.addEventListener("touchstart", stopAutoScroll, { passive: true });
    slider.addEventListener("touchend", resumeAutoScroll, { passive: true });
    slider.addEventListener("mousedown", stopAutoScroll);
    slider.addEventListener("mouseup", resumeAutoScroll);
    slider.addEventListener("mouseleave", resumeAutoScroll);

    return () => {
      stopAutoScroll();
      if (resumeTimeout !== null) window.clearTimeout(resumeTimeout);
      slider.removeEventListener("touchstart", stopAutoScroll);
      slider.removeEventListener("touchend", resumeAutoScroll);
      slider.removeEventListener("mousedown", stopAutoScroll);
      slider.removeEventListener("mouseup", resumeAutoScroll);
      slider.removeEventListener("mouseleave", resumeAutoScroll);
    };
  }, [listings.length]);

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
    <div className="mb-10 mt-12 flex flex-col gap-5 sm:mt-16 sm:gap-6">
      <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
        Bài đăng tương tự
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 md:hidden" ref={mobileSliderRef}>
        {listings.map((item) => (
          <div key={item.id} className="min-w-[85vw] max-w-[85vw] shrink-0">
            <ListingCard
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
          </div>
        ))}
      </div>

      <div className="relative hidden md:block">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {listingSlides.map((slide, idx) => (
              <div
                key={idx}
                className="grid w-full shrink-0 grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4"
              >
                {slide.map((item) => (
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
            ))}
          </div>
        </div>

        {listingSlides.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? listingSlides.length - 1 : prev - 1
                )
              }
              className="absolute left-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 shadow-lg transition-all hover:border-blue-500 hover:text-blue-500 lg:block"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % listingSlides.length)
              }
              className="absolute right-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 shadow-lg transition-all hover:border-blue-500 hover:text-blue-500 lg:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {listingSlides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-blue-500"
                      : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
