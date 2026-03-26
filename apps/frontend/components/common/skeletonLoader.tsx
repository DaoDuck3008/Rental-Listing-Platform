"use client";

import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
    />
  );
}

interface SkeletonLoaderProps {
  type: "listing-card" | "comment" | "nearby" | "text" | "rect" | "circle";
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type, count = 1, className }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "comment":
        return (
          <div className="flex gap-4 mb-6">
            <Skeleton className="size-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        );
      case "nearby":
        return (
          <div className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl">
            <Skeleton className="size-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        );
      case "listing-card":
        return (
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        );
      case "circle":
        return <Skeleton className={cn("rounded-full", className)} />;
      case "rect":
        return <Skeleton className={className} />;
      case "text":
      default:
        return <Skeleton className={cn("h-4 w-full", className)} />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
