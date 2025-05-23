import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { SearchAndFilterSection } from "@/components/search-and-filter";
import { SandwichType } from "@prisma/client";

// Define type for the search params
type SearchParams = {
  q?: string;
  type?: string;
};

// SERVER COMPONENT: Fetch sandwich data with search parameters
async function getFilteredSandwiches(searchParams: SearchParams) {
  try {
    const query = searchParams.q || '';
    const typeFilter = searchParams.type as string | undefined;

    // Build the database query
    const whereClause: {
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' } } | { description?: { contains: string; mode: 'insensitive' } }>;
      type?: SandwichType;
    } = {};
    
    // Add search query filtering (search in title, description, or restaurant name)
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    // Add type filtering
    if (typeFilter && ['RESTAURANT', 'HOMEMADE'].includes(typeFilter)) {
      whereClause.type = typeFilter as SandwichType;
    }

    // Fetch sandwiches with filters applied
    const sandwiches = await prisma.sandwich.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sandwiches;
  } catch (error) {
    console.error("Error fetching sandwiches:", error);
    return [];
  }
}

// This is a dynamic page that reads search parameters from the URL
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  
  // Convert searchParams to our custom SearchParams type
  const typedSearchParams: SearchParams = {
    q: resolvedSearchParams.q as string | undefined,
    type: resolvedSearchParams.type as string | undefined
  };
  
  // Get sandwiches based on search parameters
  const sandwiches = await getFilteredSandwiches(typedSearchParams);
  
  // Determine initial filter from search params
  const initialFilter = typedSearchParams.type || "ALL";
  
  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 relative">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute h-[400px] w-[400px] rounded-full bg-accent-tertiary/10 dark:bg-accent-tertiary/5 blur-[100px] -top-20 -right-20"></div>
          <div className="absolute h-[300px] w-[300px] rounded-full bg-accent-primary/5 dark:bg-accent-primary/5 blur-[80px] bottom-20 -left-20"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary mb-2">
              {typedSearchParams.q 
                ? `Results for "${typedSearchParams.q}"` 
                : "Discover Sandwiches"}
            </h1>
            <p className="text-text-secondary dark:text-text-secondary">
              {typedSearchParams.type === "RESTAURANT" 
                ? "Restaurant sandwiches" 
                : typedSearchParams.type === "HOMEMADE" 
                  ? "Homemade creations" 
                  : "All sandwiches"}
            </p>
          </div>
          
          <div className="glass rounded-xl overflow-hidden">
            <SearchAndFilterSection 
              sandwiches={sandwiches} 
              initialFilter={initialFilter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}