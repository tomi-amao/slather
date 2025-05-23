// This file uses RSC (React Server Components)
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import SandwichDetailClient from "./client"

// Loading component for Suspense
function SandwichLoading() {
  return (
    <div className="p-4 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-[#f1ece9] rounded-lg w-1/2 mb-6"></div>
      <div className="h-64 bg-[#f1ece9] rounded-xl mb-6"></div>
      <div className="h-4 bg-[#f1ece9] rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-[#f1ece9] rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-[#f1ece9] rounded w-2/3 mb-4"></div>
      <div className="h-10 bg-[#f1ece9] rounded-xl w-full mb-6"></div>
    </div>
  )
}

// Async server component to fetch sandwich data
async function SandwichDetail({ id }: { id: string }) {
  // Fetch sandwich with related data
  const sandwich = await prisma.sandwich.findUnique({
    where: { id },
    include: {
      restaurant: true,
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  // Return 404 if sandwich not found
  if (!sandwich) {
    notFound()
  }

  // Get the latest rating
  const rating = sandwich.ratings[0]
  
  // Format date
  const formattedDate = new Date(sandwich.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Format ingredients as array if it's a string
  const ingredientsArray: string[] = typeof sandwich.ingredients === 'string' 
    ? sandwich.ingredients.split(',').map((i: string) => i.trim()).filter(Boolean)
    : (sandwich.ingredients as string[] || [])
  
  // Serialize the data to remove Prisma-specific properties
  const serializedSandwich = {
    id: sandwich.id,
    title: sandwich.title,
    description: sandwich.description,
    type: sandwich.type,
    price: sandwich.price,
    images: Array.isArray(sandwich.images) ? sandwich.images : [],
    ingredients: Array.isArray(sandwich.ingredients) ? sandwich.ingredients : typeof sandwich.ingredients === 'string' ? sandwich.ingredients : '',
    createdAt: sandwich.createdAt.toISOString(),
    updatedAt: sandwich.updatedAt.toISOString(),
    userId: sandwich.userId,
    restaurantId: sandwich.restaurantId,
    // Properly serialize nested objects
    restaurant: sandwich.restaurant ? {
      id: sandwich.restaurant.id,
      name: sandwich.restaurant.name,
      address: sandwich.restaurant.address,
      city: sandwich.restaurant.city,
      state: sandwich.restaurant.state,
      country: sandwich.restaurant.country,
      website: sandwich.restaurant.website
    } : null,
    user: sandwich.user ? {
      id: sandwich.user.id,
      name: sandwich.user.name,
      image: sandwich.user.image
    } : null,
  }
  
  const serializedRating = rating ? {
    id: rating.id,
    overall: rating.overall,
    taste: rating.taste,
    texture: rating.texture,
    value: rating.value,
    presentation: rating.presentation,
    review: rating.review,
    sandwichId: rating.sandwichId,
    userId: rating.userId,
    createdAt: rating.createdAt.toISOString(),
    updatedAt: rating.updatedAt.toISOString(),
  } : undefined
  
  // Pass the prepared data to the client component
  return (
    <SandwichDetailClient 
      sandwich={serializedSandwich}
      rating={serializedRating}
      formattedDate={formattedDate}
      ingredientsArray={ingredientsArray}
    />
  )
}

// Page component
export default function SandwichPage({ params }: { params: { id: string } }) {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <Suspense fallback={<SandwichLoading />}>
        <SandwichDetail id={params.id} />
      </Suspense>
    </div>
  )
}