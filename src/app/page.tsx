import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { SearchAndFilterSection } from "@/components/search-and-filter";
import { SandwichCarousel } from "@/components/sandwich-carousel";
import { SandwichGrid } from "@/components/sandwich-grid";
import Link from "next/link";

// SERVER COMPONENT: Fetch sandwich data (this will only run on the server)
async function getSandwiches() {
  try {
    // First fetch all sandwiches with their ratings
    const allSandwiches = await prisma.sandwich.findMany({
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        ratings: {
          select: {
            overall: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate average ratings and sort manually
    const sandwichesWithAvgRating = allSandwiches.map(sandwich => {
      const avgRating = sandwich.ratings.length > 0
        ? sandwich.ratings.reduce((sum, rating) => sum + rating.overall, 0) / sandwich.ratings.length
        : 0;
      return {
        ...sandwich,
        avgRating
      };
    });

    // Sort for top rated (by average rating)
    const topRated = [...sandwichesWithAvgRating]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6);

    // Sort for trending (by creation date)
    const trending = [...allSandwiches]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

    return {
      topRated,
      trending,
    };
  } catch (error) {
    console.error("Error fetching sandwiches:", error);
    return {
      topRated: [],
      trending: [],
    };
  }
}

// SERVER COMPONENT: The main page component
export default async function Home() {
  // Fetch sandwiches data - this happens on the server only
  const { topRated, trending } = await getSandwiches();
  
  // Merge all sandwiches for the search functionality
  const allSandwiches = [...trending];
  // Add any sandwiches from topRated that aren't already in allSandwiches
  topRated.forEach(sandwich => {
    if (!allSandwiches.some(s => s.id === sandwich.id)) {
      allSandwiches.push(sandwich);
    }
  });

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-4 md:px-12 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <h2 className="text-[#191310] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Top Rated Sandwiches
          </h2>
          <SandwichCarousel sandwiches={topRated} />

          <h2 className="text-[#191310] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Recently Added
          </h2>
          <SandwichGrid sandwiches={trending} />

          <h2 className="text-[#191310] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Search & Filter Sandwiches
          </h2>
          <SearchAndFilterSection sandwiches={allSandwiches} />

          <div className="flex px-4 py-6 justify-center">
            <Link href="/sandwich/new" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e3c0a9] transition-colors">
              <span className="truncate">Submit a Sandwich</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
