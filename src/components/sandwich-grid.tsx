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

// Component to display a single sandwich card
function SandwichCard({ sandwich }: { sandwich: SandwichWithDetails }) {
  // Calculate average rating
  const avgRating = sandwich.ratings.length > 0
    ? sandwich.ratings.reduce((sum, rating) => sum + rating.overall, 0) / sandwich.ratings.length
    : 0;
  
  // Format the rating to display with a star
  const ratingDisplay = avgRating > 0 
    ? `★ ${avgRating.toFixed(1)}` 
    : "No ratings";

  return (
    <Link href={`/sandwich/${sandwich.id}`} className="flex flex-col gap-3 pb-3 group hover:opacity-95 transition-opacity">
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
        <div className="absolute top-2 right-2 bg-[#eccebf] text-[#191310] text-xs font-medium px-2 py-1 rounded-full">
          {ratingDisplay}
        </div>
      </div>
      <div>
        <p className="text-[#191310] text-base font-medium leading-normal line-clamp-1">{sandwich.title}</p>
        <p className="text-[#8c6a5a] text-sm font-normal leading-normal line-clamp-2">
          {sandwich.restaurant ? `From ${sandwich.restaurant.name}` : "Homemade"}
        </p>
      </div>
    </Link>
  );
}

export function SandwichGrid({ sandwiches }: { sandwiches: SandwichWithDetails[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {sandwiches.slice(0, 8).map((sandwich) => (
        <SandwichCard key={sandwich.id} sandwich={sandwich} />
      ))}
    </div>
  );
}