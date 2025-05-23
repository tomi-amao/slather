"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Type definition for sandwich data
type SandwichWithDetails = {
  id: string;
  title: string;
  description: string | null;
  type: 'RESTAURANT' | 'HOMEMADE';
  images: string[];
  ingredients: string[];
  createdAt: Date;
  userId: string;
  restaurantId: string | null;
  restaurant?: {
    name: string;
  } | null;
  ratings: {
    overall: number;
  }[];
  user: {
    name: string | null;
  } | null;
};

export function SandwichCarousel({ sandwiches }: { sandwiches: SandwichWithDetails[] }) {
  return (
    <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-stretch p-4 gap-3">
        {sandwiches.map((sandwich) => (
          <div key={sandwich.id} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60 max-w-72">
            <Link href={`/sandwich/${sandwich.id}`} className="group">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                {sandwich.images && sandwich.images.length > 0 ? (
                  <Image
                    src={sandwich.images[0]}
                    alt={sandwich.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f1ece9] flex items-center justify-center">
                    <span className="text-[#8c6a5a]">No image</span>
                  </div>
                )}
                {sandwich.ratings.length > 0 && (
                  <div className="absolute top-2 right-2 bg-[#eccebf] text-[#191310] text-xs font-medium px-2 py-1 rounded-full">
                    ★ {(sandwich.ratings.reduce((sum, r) => sum + r.overall, 0) / sandwich.ratings.length).toFixed(1)}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-[#191310] text-base font-medium leading-normal">{sandwich.title}</p>
                <p className="text-[#8c6a5a] text-sm font-normal leading-normal">
                  {sandwich.restaurant ? `From ${sandwich.restaurant.name}` : "Homemade"}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}