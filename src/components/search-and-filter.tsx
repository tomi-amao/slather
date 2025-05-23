"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

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
import { SandwichCard } from "./sandwich-card";

export function SearchAndFilterSection({
  sandwiches,
  initialFilter = "ALL"
}: {
  sandwiches: SandwichWithDetails[];
  initialFilter?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("RATING");
  const [filteredSandwiches, setFilteredSandwiches] = useState(sandwiches);
  const [showFilters, setShowFilters] = useState(false);

  // Filter sandwiches based on search query and type filter
  useEffect(() => {
    let results = [...sandwiches];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        sandwich => 
          sandwich.title.toLowerCase().includes(query) || 
          (sandwich.description && sandwich.description.toLowerCase().includes(query)) ||
          (sandwich.restaurant && sandwich.restaurant.name.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (typeFilter !== "ALL") {
      results = results.filter(sandwich => sandwich.type === typeFilter);
    }
    
    // Apply sorting
    if (sortBy === "RATING") {
      results.sort((a, b) => {
        const aRating = a.ratings.length > 0 
          ? a.ratings.reduce((sum, r) => sum + r.overall, 0) / a.ratings.length 
          : 0;
        const bRating = b.ratings.length > 0 
          ? b.ratings.reduce((sum, r) => sum + r.overall, 0) / b.ratings.length 
          : 0;
        return bRating - aRating;
      });
    } else if (sortBy === "NEWEST") {
      results.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "OLDEST") {
      results.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    
    setFilteredSandwiches(results);
  }, [searchQuery, typeFilter, sortBy, sandwiches]);

  return (
    <>
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-[#8c6a5a] flex border-none bg-[#f1ece9] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <Search size={24} />
            </div>
            <input
              placeholder="Search for sandwiches or locations"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-full placeholder:text-[#8c6a5a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      <div className="px-4 py-2 flex justify-between items-center flex-wrap gap-2">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[#191310] text-sm font-medium"
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[#8c6a5a] text-sm">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#f1ece9] text-[#191310] text-sm rounded-lg px-3 py-1 border-none focus:ring-0"
          >
            <option value="RATING">Top Rated</option>
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="px-4 py-2 mb-2 flex gap-2 flex-wrap">
          <button 
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1 rounded-full text-sm ${
              typeFilter === "ALL" 
                ? "bg-[#eccebf] text-[#191310]" 
                : "bg-[#f1ece9] text-[#8c6a5a]"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setTypeFilter("RESTAURANT")}
            className={`px-3 py-1 rounded-full text-sm ${
              typeFilter === "RESTAURANT" 
                ? "bg-[#eccebf] text-[#191310]" 
                : "bg-[#f1ece9] text-[#8c6a5a]"
            }`}
          >
            Restaurant
          </button>
          <button 
            onClick={() => setTypeFilter("HOMEMADE")}
            className={`px-3 py-1 rounded-full text-sm ${
              typeFilter === "HOMEMADE" 
                ? "bg-[#eccebf] text-[#191310]" 
                : "bg-[#f1ece9] text-[#8c6a5a]"
            }`}
          >
            Homemade
          </button>
        </div>
      )}

      {filteredSandwiches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredSandwiches.map((sandwich) => (
            <SandwichCard key={sandwich.id} sandwich={sandwich} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-[#8c6a5a] text-lg">No sandwiches found matching your criteria</p>
          <p className="text-[#8c6a5a] text-sm mt-2">Try adjusting your filters or search query</p>
        </div>
      )}
    </>
  );
}