import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { SearchAndFilterSection } from "@/components/search-and-filter";
import { SandwichCarousel } from "@/components/sandwich-carousel";
import { SandwichGrid } from "@/components/sandwich-grid";
import Link from "next/link";
import { Star, TrendingUp, Search, Camera, Filter } from "lucide-react";

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

// Modern Hero component
function HeroSection() {
  return (
    <div className="glass rounded-2xl p-6 lg:p-8 mb-10 relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 text-6xl transform rotate-6">🥪</div>
        <div className="absolute bottom-0 left-0 text-4xl transform -rotate-6">🍞</div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="text-5xl mb-6 animate-float">🥪</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3 tracking-tight">
          Rate, Share, Discover
        </h1>
        <p className="text-text-secondary text-lg max-w-lg mb-8">
          Find your next amazing sandwich or share that epic bite you just had
        </p>
        <Link 
          href="/sandwich/new" 
          className="gradient-blue text-white text-base font-medium px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:translate-y-[-2px]"
        >
          <span>Post a Sandwich</span>
        </Link>
      </div>
    </div>
  )
}

// Feature cards component
function FeatureCards() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find",
      description: "Spot tasty sandwiches near you",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Rate",
      description: "Tell us what's worth the bite",
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Snap",
      description: "Share your sandwich photos",
    },
    {
      icon: <Filter className="h-6 w-6" />,
      title: "Filter",
      description: "Browse by style or ingredient",
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="glass p-5 rounded-xl text-center hover:shadow-soft-lg transition-all duration-300 hover:translate-y-[-2px]"
        >
          <div className="mx-auto size-12 bg-white rounded-full flex items-center justify-center shadow-soft mb-4 text-accent-primary">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-text-primary mb-1 text-lg">{feature.title}</h3>
          <p className="text-sm text-text-secondary">{feature.description}</p>
        </div>
      ))}
    </div>
  )
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="relative flex-1">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-accent-tertiary/10 blur-[120px] -top-20 -right-20"></div>
          <div className="absolute h-[400px] w-[400px] rounded-full bg-accent-primary/5 blur-[100px] bottom-20 -left-20"></div>
          <div className="absolute h-[300px] w-[300px] rounded-full bg-accent-secondary/10 blur-[80px] bottom-40 right-60"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 xl:px-0 py-8 lg:py-12 max-w-6xl mx-auto">
          <HeroSection />
          <FeatureCards />
          
          {/* Top Rated Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-soft text-accent-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-text-primary leading-tight">
                  Top Rated Sandwiches
                </h2>
                <p className="text-sm text-text-secondary">The ones worth fighting for</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SandwichCarousel sandwiches={topRated} />
            </div>
          </div>

          {/* Trending Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-soft text-accent-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-text-primary leading-tight">
                  Just Added
                </h2>
                <p className="text-sm text-text-secondary">Fresh finds from fellow sandwich lovers</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SandwichGrid sandwiches={trending} />
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-soft text-accent-primary">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-text-primary leading-tight">
                  Find Sandwiches
                </h2>
                <p className="text-sm text-text-secondary">Filter by what you're craving</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 mb-2">
              <SearchAndFilterSection sandwiches={allSandwiches} />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-10">
            <div className="glass p-8 lg:p-10 rounded-2xl shadow-soft-lg relative overflow-hidden">
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-subtle-accent pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="size-16 bg-white rounded-full shadow-soft flex items-center justify-center text-3xl mx-auto mb-5">
                  🥪
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary mb-3">
                  Had an epic sandwich?
                </h3>
                <p className="text-text-secondary text-lg mb-6 max-w-lg mx-auto">
                  Don't keep that deliciousness to yourself! Share it, rate it, make others jealous.
                </p>
                <Link 
                  href="/sandwich/new" 
                  className="gradient-blue text-white text-base font-medium px-8 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 inline-flex hover:translate-y-[-2px]"
                >
                  <span>Post Your Sandwich</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
