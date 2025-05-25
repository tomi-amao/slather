"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Type definitions
type SerializedRestaurant = {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  website: string | null
}

type SerializedUser = {
  id: string
  name: string | null
  image: string | null
}

type SerializedRating = {
  id: string
  overall: number
  taste: number
  texture: number | null
  value: number | null
  presentation: number
  review: string | null
  sandwichId: string
  userId: string | null
  createdAt: string
  updatedAt: string
}

type SerializedSandwich = {
  id: string
  title: string
  description: string
  type: string
  price: number | null
  images: string[]
  ingredients: string | string[]
  createdAt: string
  updatedAt: string
  userId: string | null
  restaurantId: string | null
  restaurant: SerializedRestaurant | null
  user: SerializedUser | null
}

type SandwichDetailProps = {
  sandwich: SerializedSandwich
  rating: SerializedRating | undefined
  formattedDate: string
  ingredientsArray: string[]
}

// Image Gallery component with lightbox
function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  if (!images || images.length === 0) {
    return (
      <div className="bg-[#f1ece9] h-64 rounded-xl flex items-center justify-center">
        <p className="text-[#8c6a5a]">No images available</p>
      </div>
    )
  }
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:aspect-[16/9] mb-8">
        {/* Main large image */}
        <div className="md:col-span-2 lg:col-span-2 rounded-xl overflow-hidden relative aspect-video md:aspect-auto">
          <Image
            src={images[0]}
            alt={`${title} main image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => setSelectedImage(images[0])}
          />
        </div>
        
        {/* Smaller images grid */}
        <div className="md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden relative aspect-square"
            >
              <Image
                src={image}
                alt={`${title} image ${index + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            </motion.div>
          ))}
          
          {/* Show "View more" overlay on the last image if there are more than 5 */}
          {images.length > 5 && (
            <div 
              className="rounded-xl overflow-hidden relative aspect-square cursor-pointer"
              onClick={() => setSelectedImage(images[4])}
            >
              <Image
                src={images[4]}
                alt={`${title} image 5`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover filter brightness-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                +{images.length - 4} more
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-3 right-3 z-10 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              
              <div className="relative w-full h-full max-h-[85vh]">
                <Image
                  src={selectedImage}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              
              {/* Navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${img === selectedImage ? 'bg-white' : 'bg-white/50'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Component to display ratings with animation - Updated for 10-point scale
function RatingDisplay({ name, value }: { name: string; value: number }) {
  // Convert 10-point scale to percentage for visual display
  const percentage = (value / 10) * 100;
  
  return (
    <div className="flex flex-col items-center p-3">
      <div className="flex flex-col items-center">
        {/* Circular progress indicator */}
        <div className="relative w-12 h-12 mb-2">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <motion.path
              className="text-[#eccebf]"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${percentage} 100` }}
              transition={{ duration: 1, delay: 0.2 }}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          {/* Rating number in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-sm font-bold text-[#191310]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {value.toFixed(1)}
            </motion.span>
          </div>
        </div>
      </div>
      <span className="text-xs text-[#8c6a5a] text-center font-medium">{name}</span>
    </div>
  )
}

// Share button component
function ShareButton({ 
  network, 
  url, 
  title = '', 
  media = '' 
}: { 
  network: 'twitter' | 'facebook' | 'pinterest' | 'email'; 
  url: string; 
  title?: string;
  media?: string;
}) {
  const handleShare = () => {
    let shareUrl = '';
    
    switch(network) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(media)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this sandwich: ${url}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="w-10 h-10 rounded-full bg-[#faf7f5] flex items-center justify-center text-[#8c6a5a] hover:bg-[#eccebf] hover:text-[#191310] transition-colors"
      aria-label={`Share on ${network}`}
    >
      {network === 'twitter' && (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      )}
      {network === 'facebook' && (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      )}
      {network === 'pinterest' && (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0a12 12 0 0 0-4.373 23.178c-.018-.394-.003-1.082.006-1.58l.822-3.487s-.205-.41-.205-1.013c0-.948.55-1.655 1.235-1.655.582 0 .863.437.863.96 0 .585-.373 1.46-.566 2.272-.16.69.341 1.25 1.011 1.25 1.213 0 2.152-1.291 2.152-3.16 0-1.645-1.163-2.806-2.84-2.806-1.93 0-3.07 1.466-3.07 2.986 0 .59.228 1.222.511 1.568a.386.386 0 0 1 .11.373c-.12.504-.387 1.587-.44 1.802-.069.291-.23.35-.53.211-1.398-.654-2.2-2.708-2.22-4.38 0-2.36 1.724-4.528 4.952-4.528 2.605 0 4.618 1.954 4.618 4.583 0 2.731-1.72 4.924-4.088 4.924-.798 0-1.547-.416-1.803-.899l-.49 1.86c-.178.685-.659 1.544-.982 2.067A12 12 0 1 0 12 0"/>
        </svg>
      )}
      {network === 'email' && (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </motion.button>
  );
}

// Main client component
export default function SandwichDetailClient({ 
  sandwich, 
  rating, 
  formattedDate, 
  ingredientsArray 
}: SandwichDetailProps) {
  // For sharing functionality
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/sandwich/${sandwich.id}`
    : `/sandwich/${sandwich.id}`;
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm mb-6">
        <Link href="/" className="text-[#8c6a5a] hover:text-[#191310]">Home</Link>
        <span className="mx-2 text-[#8c6a5a]">/</span>
        <Link href="/sandwich" className="text-[#8c6a5a] hover:text-[#191310]">Sandwiches</Link>
        <span className="mx-2 text-[#8c6a5a]">/</span>
        <span className="text-[#191310] font-medium truncate max-w-[200px]">{sandwich.title}</span>
      </nav>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title and metadata */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#191310]">{sandwich.title}</h1>
            <div className="flex items-center mt-2 text-sm text-[#8c6a5a]">
              <span className="inline-block bg-[#eccebf] text-[#191310] text-xs font-medium px-3 py-1 rounded-full mr-3">
                {sandwich.type}
              </span>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Author info */}
          <div className="flex items-center bg-[#faf7f5] px-4 py-2 rounded-full">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#eccebf] flex items-center justify-center overflow-hidden mr-3">
              {sandwich.user?.image ? (
                <Image 
                  src={sandwich.user.image} 
                  alt={sandwich.user.name || "User"} 
                  width={40} 
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-[#191310]">
                  {(sandwich.user?.name || "User").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-[#191310] leading-tight">
                {sandwich.user?.name || "Anonymous"}
              </p>
              <p className="text-xs text-[#8c6a5a]">
                Sandwich Enthusiast
              </p>
            </div>
          </div>
        </div>
        
        {/* Image Gallery with lightbox */}
        <ImageGallery 
          images={Array.isArray(sandwich.images) ? sandwich.images : []} 
          title={sandwich.title} 
        />
        
        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Description card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#f1ece9]"
            >
              <h2 className="text-xl font-bold text-[#191310] mb-4">About this sandwich</h2>
              <p className="text-[#191310] whitespace-pre-line leading-relaxed">{sandwich.description}</p>
            </motion.div>
            
            {/* If homemade, show ingredients */}
            {sandwich.type === "HOMEMADE" && ingredientsArray.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#f1ece9]"
              >
                <h2 className="text-xl font-bold text-[#191310] mb-4">Ingredients</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ingredientsArray.map((ingredient, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                    >
                      <span className="h-2 w-2 bg-[#eccebf] rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-[#191310]">{ingredient}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar column */}
          <div className="lg:col-span-1">
            {/* Ratings */}
            {rating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#f1ece9]"
              >
                <h2 className="text-xl font-bold text-[#191310] mb-4">Ratings</h2>
                <div className="bg-[#faf7f5] rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <RatingDisplay name="Overall" value={rating.overall} />
                    <RatingDisplay name="Taste" value={rating.taste} />
                    <RatingDisplay name="Texture" value={typeof rating.texture === 'number' ? rating.texture : (typeof rating.value === 'number' ? rating.value : 0)} />
                    <RatingDisplay name="Presentation" value={rating.presentation} />
                  </div>
                  
                  {/* Average rating - Updated for 10-point scale */}
                  <div className="flex items-center justify-center mt-3 p-3 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-[#191310] mr-2">
                      {(
                        (rating.overall + rating.taste +
                          (typeof rating.texture === 'number' ? rating.texture : (typeof rating.value === 'number' ? rating.value : 0)) +
                          rating.presentation
                        ) / 4
                      ).toFixed(1)}
                    </div>
                    <div className="text-sm text-[#8c6a5a]">
                      out of 10
                    </div>
                  </div>
                  
                  {rating.review && (
                    <div className="mt-4 pt-4 border-t border-[#f1ece9]">
                      <p className="text-[#191310] italic">{rating.review}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Restaurant details if available */}
            {sandwich.type === "RESTAURANT" && sandwich.restaurant && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#f1ece9]"
              >
                <h2 className="text-xl font-bold text-[#191310] mb-4">Restaurant Information</h2>
                <div className="bg-[#faf7f5] rounded-lg p-4">
                  <h3 className="font-medium text-[#191310] text-lg">{sandwich.restaurant.name}</h3>
                  
                  {sandwich.restaurant.address && (
                    <p className="text-sm text-[#8c6a5a] mt-2 flex items-start">
                      <svg className="w-4 h-4 mr-1 mt-0.5 text-[#eccebf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{sandwich.restaurant.address}</span>
                    </p>
                  )}
                  
                  {sandwich.restaurant.city && sandwich.restaurant.state && (
                    <p className="text-sm text-[#8c6a5a] ml-5 pl-1">
                      {sandwich.restaurant.city}, {sandwich.restaurant.state}
                      {sandwich.restaurant.country && `, ${sandwich.restaurant.country}`}
                    </p>
                  )}
                  
                  {sandwich.restaurant.website && (
                    <p className="text-sm mt-2 flex items-start">
                      <svg className="w-4 h-4 mr-1 mt-0.5 text-[#eccebf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                      </svg>
                      <a 
                        href={sandwich.restaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#eccebf] hover:underline"
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                  
                  {/* Map button */}
                  {(sandwich.restaurant.address || (sandwich.restaurant.city && sandwich.restaurant.state)) && (
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        [
                          sandwich.restaurant.name,
                          sandwich.restaurant.address,
                          sandwich.restaurant.city,
                          sandwich.restaurant.state,
                          sandwich.restaurant.country
                        ].filter(Boolean).join(', ')
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block w-full text-center bg-white text-[#191310] font-medium rounded-full px-4 py-2 hover:bg-[#f1ece9] transition-colors"
                    >
                      View on Map
                    </a>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#f1ece9]"
            >
              <h2 className="text-xl font-bold text-[#191310] mb-4">Share this sandwich</h2>
              <div className="flex justify-center gap-4">
                <ShareButton
                  network="twitter"
                  url={shareUrl}
                  title={`Check out this ${sandwich.title} sandwich on Slather!`}
                />
                <ShareButton
                  network="facebook"
                  url={shareUrl}
                />
                <ShareButton
                  network="pinterest"
                  url={shareUrl}
                  title={sandwich.title}
                  media={Array.isArray(sandwich.images) && sandwich.images.length > 0 ? sandwich.images[0] : ''}
                />
                <ShareButton
                  network="email"
                  url={shareUrl}
                  title={`Check out this ${sandwich.title} sandwich on Slather!`}
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA to create your own */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-[#eccebf] rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-[#191310] mb-3">Drop a sammie</h2>
              <Link
            href="/sandwich/new"
            className="inline-block bg-[#191310] text-white font-medium rounded-full px-6 py-3 hover:bg-opacity-90 transition-colors"
          >
            Post a new sandwich
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}