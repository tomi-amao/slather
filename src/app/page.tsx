import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { SearchAndFilterSection } from "@/components/search-and-filter";
import { SandwichCarousel } from "@/components/sandwich-carousel";
import { SandwichGrid } from "@/components/sandwich-grid";
import { Star, TrendingUp, Search, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

type SandwichWithRatings = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  type: 'RESTAURANT' | 'HOMEMADE';
  price: number | null;
  createdAt: Date;
  ingredients: string[];
  userId: string;
  restaurantId: string | null;
  restaurant: {
    name: string;
  } | null;
  ratings: {
    overall: number;
  }[];
  user: {
    name: string | null;
  } | null;
};

// SERVER COMPONENT: Fetch sandwich data (this will only run on the server)
async function getSandwiches() {
  try {
    // First fetch all sandwiches with their ratings
    const allSandwiches: SandwichWithRatings[] = await prisma.sandwich.findMany({
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
    const sandwichesWithAvgRating = allSandwiches.map((sandwich: SandwichWithRatings) => {
      const avgRating = sandwich.ratings.length > 0
        ? sandwich.ratings.reduce((sum: number, rating: { overall: number }) => sum + rating.overall, 0) / sandwich.ratings.length
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

// Modern Hero component

// Feature cards component

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
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="relative flex-1">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-accent-tertiary/10 dark:bg-accent-tertiary/5 blur-[120px] -top-20 -right-20"></div>
          <div className="absolute h-[400px] w-[400px] rounded-full bg-accent-primary/5 dark:bg-accent-primary/5 blur-[100px] bottom-20 -left-20"></div>
          <div className="absolute h-[300px] w-[300px] rounded-full bg-accent-secondary/10 dark:bg-accent-secondary/5 blur-[80px] bottom-40 right-60"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 xl:px-0 py-8 lg:py-12 max-w-6xl mx-auto">
          
          {/* Hero Section with Centered Button */}
          <div className="mb-12 lg:mb-16">
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="flex justify-center">
                <Link 
                  href="/sandwich/new"
                  className="group inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold text-lg">Drop a Sammie</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Top Rated Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-soft text-accent-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h2 className=" text-lg lg:text-xl font-bold text-text-primary dark:text-text-primary leading-tight">
                  Top Rated Sandwiches
                </h2>
                <p className="text-sm text-text-secondary dark:text-text-secondary">The ones worth fighting for</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SandwichCarousel sandwiches={topRated} />
            </div>
          </div>

          {/* Trending Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-soft text-accent-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className=" text-lg lg:text-xl font-bold text-text-primary dark:text-text-primary leading-tight">
                  Just Slathered
                </h2>
                <p className="text-sm text-text-secondary dark:text-text-secondary">Fresh finds from fellow sandwich lovers</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SandwichGrid sandwiches={trending} />
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-soft text-accent-primary">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h2 className=" text-lg lg:text-xl font-bold text-text-primary dark:text-text-primary leading-tight">
                  Find Sandwiches
                </h2>
                <p className="text-sm text-text-secondary dark:text-text-secondary">Filter the slather</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SearchAndFilterSection sandwiches={allSandwiches} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
