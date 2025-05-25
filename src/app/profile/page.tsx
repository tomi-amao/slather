import { Header } from "@/components/header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, MapPin, Calendar, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type UserWithProfile = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  createdAt: Date;
  sandwiches: {
    id: string;
    title: string;
    type: string;
    images: string[];
    ratings: {
      overall: number;
    }[];
    likes: {
      id: string;
    }[];
    restaurant: {
      name: string;
    } | null;
  }[];
  ratings: {
    overall: number;
  }[];
  _count: {
    sandwiches: number;
    ratings: number;
    followers: number;
    following: number;
  };
};

async function getUserProfile(userId: string): Promise<UserWithProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sandwiches: {
          include: {
            ratings: true,
            likes: true,
            restaurant: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        ratings: true,
        _count: {
          select: {
            sandwiches: true,
            ratings: true,
            followers: true,
            following: true
          }
        }
      }
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userProfile = await getUserProfile(session.user.id);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background dark:bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary mb-2">
              Profile not found
            </h1>
            <p className="text-text-secondary dark:text-text-secondary">
              Unable to load your profile. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Calculate average rating across all user's sandwiches
  const totalRatings = userProfile.sandwiches.reduce((acc: number, sandwich) => {
    return acc + sandwich.ratings.reduce((sum: number, rating) => sum + rating.overall, 0);
  }, 0);
  const ratingsCount = userProfile.sandwiches.reduce((acc: number, sandwich) => acc + sandwich.ratings.length, 0);
  const averageRating = ratingsCount > 0 ? totalRatings / ratingsCount : 0;

  // Calculate total likes
  const totalLikes = userProfile.sandwiches.reduce((acc: number, sandwich) => acc + sandwich.likes.length, 0);

  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 relative">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute h-[400px] w-[400px] rounded-full bg-accent-tertiary/10 dark:bg-accent-tertiary/5 blur-[100px] -top-20 -right-20"></div>
          <div className="absolute h-[300px] w-[300px] rounded-full bg-accent-primary/5 dark:bg-accent-primary/5 blur-[80px] bottom-20 -left-20"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                {userProfile.image ? (
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cover bg-center border-4 border-white dark:border-background-secondary shadow-soft"
                    style={{ backgroundImage: `url("${userProfile.image}")` }}
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-background-secondary dark:bg-background border-4 border-white dark:border-background-secondary shadow-soft flex items-center justify-center">
                    <User size={40} className="text-accent-secondary" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white dark:border-background-secondary"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary mb-2">
                      {userProfile.name || "Anonymous User"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary dark:text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Joined {userProfile.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      {userProfile.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {userProfile.location}
                        </span>
                      )}
                    </div>
                    {userProfile.bio && (
                      <p className="mt-3 text-text-primary dark:text-text-primary max-w-md">
                        {userProfile.bio}
                      </p>
                    )}
                  </div>
                  
                  <button className="flex items-center gap-2 bg-white dark:bg-background-secondary text-text-primary dark:text-text-primary px-4 py-2 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200">
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border-color dark:border-border-color">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {userProfile._count.sandwiches}
                </div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">
                  Sandwiches
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {userProfile._count.ratings}
                </div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">
                  Reviews
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {totalLikes}
                </div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">
                  Likes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary dark:text-text-secondary">
                  Avg Rating
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary dark:text-text-primary">
                Recent Sandwiches
              </h2>
              <Link 
                href="/my-sandwiches"
                className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            {userProfile.sandwiches.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🥪</div>
                <h3 className="text-lg font-medium text-text-primary dark:text-text-primary mb-2">
                  No sandwiches yet
                </h3>
                <p className="text-text-secondary dark:text-text-secondary mb-6">
                  Share your first sandwich creation with the community!
                </p>
                <Link 
                  href="/sandwich/new"
                  className="inline-flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
                >
                  Create Your First Sandwich
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.sandwiches.slice(0, 6).map((sandwich) => (
                  <Link
                    key={sandwich.id}
                    href={`/sandwich/${sandwich.id}`}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-background-secondary rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-200">
                      {sandwich.images.length > 0 && (
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={sandwich.images[0]}
                            alt={sandwich.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-text-primary dark:text-text-primary mb-1 line-clamp-2">
                          {sandwich.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sandwich.type === 'RESTAURANT' 
                              ? 'bg-accent-primary/10 text-accent-primary' 
                              : 'bg-accent-secondary/10 text-accent-secondary'
                          }`}>
                            {sandwich.type === 'RESTAURANT' ? 'Restaurant' : 'Homemade'}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-text-secondary dark:text-text-secondary">
                              {sandwich.ratings.length > 0 
                                ? (sandwich.ratings.reduce((sum: number, r) => sum + r.overall, 0) / sandwich.ratings.length).toFixed(1)
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}