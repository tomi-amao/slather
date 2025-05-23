// Dynamic sandwich detail page
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"

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

// Component to display ratings
function RatingDisplay({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < value ? 'text-[#eccebf]' : 'text-gray-300'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="mt-1 text-sm text-[#8c6a5a]">{name}</span>
    </div>
  )
}

// Async server component to fetch and display sandwich details
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
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#191310] mb-6">{sandwich.title}</h1>
      
      {/* Image Gallery */}
      <div className="mb-8">
        {sandwich.images && sandwich.images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sandwich.images.map((image, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <Image
                  src={image}
                  alt={`${sandwich.title} image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f1ece9] h-64 rounded-xl flex items-center justify-center">
            <p className="text-[#8c6a5a]">No images available</p>
          </div>
        )}
      </div>
      
      {/* Sandwich Info */}
      <div className="bg-[#faf7f5] rounded-xl p-6 mb-8">
        {/* Type, Restaurant & Author */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <span className="inline-block bg-[#eccebf] text-[#191310] text-xs font-medium px-3 py-1 rounded-full mr-2">
              {sandwich.type}
            </span>
            {sandwich.restaurant && (
              <span className="text-[#8c6a5a] text-sm">
                from <span className="font-medium text-[#191310]">{sandwich.restaurant.name}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center mt-2 sm:mt-0">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#eccebf] flex items-center justify-center overflow-hidden">
              {sandwich.user?.image ? (
                <Image 
                  src={sandwich.user.image} 
                  alt={sandwich.user.name || "User"} 
                  width={32} 
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-[#191310]">
                  {(sandwich.user?.name || "User").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="ml-2 text-sm text-[#8c6a5a]">
              by <span className="font-medium text-[#191310]">{sandwich.user?.name || "Anonymous"}</span>
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[#191310] mb-6 whitespace-pre-line">{sandwich.description}</p>
        
        {/* If homemade, show ingredients */}
        {sandwich.type === "HOMEMADE" && sandwich.ingredients && sandwich.ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#191310] mb-2">Ingredients</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sandwich.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-2 w-2 bg-[#eccebf] rounded-full mr-2"></span>
                  <span className="text-[#191310]">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Restaurant details if available */}
        {sandwich.type === "RESTAURANT" && sandwich.restaurant && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#191310] mb-2">Restaurant Information</h3>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-[#191310]">{sandwich.restaurant.name}</h4>
              {sandwich.restaurant.address && (
                <p className="text-sm text-[#8c6a5a] mt-1">{sandwich.restaurant.address}</p>
              )}
              {sandwich.restaurant.city && sandwich.restaurant.state && (
                <p className="text-sm text-[#8c6a5a]">
                  {sandwich.restaurant.city}, {sandwich.restaurant.state}
                  {sandwich.restaurant.country && `, ${sandwich.restaurant.country}`}
                </p>
              )}
              {sandwich.restaurant.website && (
                <a 
                  href={sandwich.restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#eccebf] hover:underline mt-1 inline-block"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Ratings */}
        {rating && (
          <div>
            <h3 className="text-lg font-medium text-[#191310] mb-2">Ratings</h3>
            <div className="bg-white rounded-lg p-4">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <RatingDisplay name="Overall" value={rating.overall} />
                <RatingDisplay name="Taste" value={rating.taste} />
                <RatingDisplay name="Value" value={rating.value} />
                <RatingDisplay name="Presentation" value={rating.presentation} />
              </div>
              {rating.review && (
                <div className="mt-4 pt-4 border-t border-[#f1ece9]">
                  <p className="text-[#191310] italic">{rating.review}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
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