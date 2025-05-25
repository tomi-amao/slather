import { Header } from "@/components/header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Calendar, Star, Heart, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SandwichWithDetails = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  type: string;
  price: number | null;
  createdAt: Date;
  restaurant: {
    name: string;
    city: string | null;
    state: string | null;
  } | null;
  ratings: {
    overall: number;
  }[];
  likes: {
    id: string;
  }[];
  comments: {
    id: string;
  }[];
};

async function getUserSandwiches(userId: string): Promise<SandwichWithDetails[]> {
  try {
    const sandwiches = await prisma.sandwich.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: { name: true, city: true, state: true }
        },
        ratings: {
          select: { overall: true }
        },
        likes: {
          select: { id: true }
        },
        comments: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sandwiches;
  } catch (error) {
    console.error("Error fetching user sandwiches:", error);
    return [];
  }
}

export default async function MySandwichesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const sandwiches = await getUserSandwiches(session.user.id);

  // Calculate stats
  const restaurantSandwiches = sandwiches.filter((s) => s.type === 'RESTAURANT');
  const homemadeSandwiches = sandwiches.filter((s) => s.type === 'HOMEMADE');
  const totalLikes = sandwiches.reduce((acc: number, s) => acc + s.likes.length, 0);

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary mb-2">
                My Sandwiches
              </h1>
              <p className="text-text-secondary dark:text-text-secondary">
                Manage and view all your sandwich creations
              </p>
            </div>
            <Link 
              href="/sandwich/new"
              className="flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
            >
              <Plus size={20} />
              <span>Create New</span>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {sandwiches.length}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary">
                Total Sandwiches
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {restaurantSandwiches.length}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary">
                Restaurant
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {homemadeSandwiches.length}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary">
                Homemade
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {totalLikes}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary">
                Total Likes
              </div>
            </div>
          </div>

          {/* Sandwiches Grid */}
          {sandwiches.length === 0 ? (
            <div className="glass rounded-xl p-8 sm:p-12 text-center">
              <div className="text-6xl mb-6">🥪</div>
              <h2 className="text-xl font-bold text-text-primary dark:text-text-primary mb-3">
                No sandwiches yet
              </h2>
              <p className="text-text-secondary dark:text-text-secondary mb-8 max-w-md mx-auto">
                Start building your sandwich collection! Share your favorite restaurant finds or homemade creations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/sandwich/new"
                  className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
                >
                  <Plus size={18} />
                  Create Your First Sandwich
                </Link>
                <Link 
                  href="/discover"
                  className="inline-flex items-center gap-2 bg-white dark:bg-background-secondary text-text-primary dark:text-text-primary px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
                >
                  Explore Others
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sandwiches.map((sandwich) => {
                  const averageRating = sandwich.ratings.length > 0 
                    ? sandwich.ratings.reduce((sum: number, r) => sum + r.overall, 0) / sandwich.ratings.length 
                    : 0;
                  
                  return (
                    <div key={sandwich.id} className="group relative">
                      <Link 
                        href={`/sandwich/${sandwich.id}`}
                        className="block bg-white dark:bg-background-secondary rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-200"
                      >
                        {/* Image */}
                        {sandwich.images.length > 0 && (
                          <div className="aspect-square relative overflow-hidden">
                            <Image
                              src={sandwich.images[0]}
                              alt={sandwich.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Type Badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                                sandwich.type === 'RESTAURANT' 
                                  ? 'bg-accent-primary/90 text-white' 
                                  : 'bg-accent-secondary/90 text-white'
                              }`}>
                                {sandwich.type === 'RESTAURANT' ? 'Restaurant' : 'Homemade'}
                              </span>
                            </div>
                            {/* Quick Actions */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <button className="p-2 bg-white/90 dark:bg-background/90 rounded-full shadow-soft hover:bg-white dark:hover:bg-background transition-colors">
                                  <Edit2 size={14} className="text-text-primary dark:text-text-primary" />
                                </button>
                                <button className="p-2 bg-white/90 dark:bg-background/90 rounded-full shadow-soft hover:bg-error/10 hover:text-error transition-colors">
                                  <Trash2 size={14} className="text-text-primary dark:text-text-primary hover:text-error" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-text-primary dark:text-text-primary mb-2 line-clamp-2 group-hover:text-accent-primary transition-colors">
                            {sandwich.title}
                          </h3>
                          
                          {sandwich.restaurant && (
                            <p className="text-sm text-text-secondary dark:text-text-secondary mb-2 line-clamp-1">
                              {sandwich.restaurant.name}
                              {sandwich.restaurant.city && ` • ${sandwich.restaurant.city}`}
                            </p>
                          )}

                          {sandwich.description && (
                            <p className="text-sm text-text-secondary dark:text-text-secondary mb-3 line-clamp-2">
                              {sandwich.description}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              {averageRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-500 fill-current" />
                                  <span className="text-text-secondary dark:text-text-secondary">
                                    {averageRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {sandwich.likes.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Heart size={14} className="text-error fill-current" />
                                  <span className="text-text-secondary dark:text-text-secondary">
                                    {sandwich.likes.length}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-text-secondary dark:text-text-secondary">
                              <Calendar size={14} />
                              <span>{sandwich.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {sandwich.price && (
                            <div className="mt-2 pt-2 border-t border-border-color dark:border-border-color">
                              <span className="text-accent-primary font-semibold">
                                ${sandwich.price.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}