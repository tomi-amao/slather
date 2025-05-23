"use client"

import React, { useState } from 'react';
import { PlusCircle, Star, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SandwichReviewButton = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    router.push('/sandwich/new');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative overflow-hidden group
        bg-white/15 dark:bg-white/10
        hover:bg-white/25 dark:hover:bg-white/20
        text-black font-bold text-lg
        px-8 py-4 rounded-2xl
        shadow-lg hover:shadow-xl
        transform transition-all duration-300 ease-out
        ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100'}
        ${isPressed ? 'scale-95' : ''}
        border border-white/30
        backdrop-blur-md
      `}
      style={{
        background: ''
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl backdrop-blur-sm" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Button content */}
      <div className="relative flex items-center gap-3 text-shadow-sm">
        <div className="relative">
          <Utensils 
            size={24} 
            className={`text-white/90 drop-shadow-md transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} 
          />
          {/* Floating stars animation */}
          <Star 
            size={12} 
            className={`absolute -top-2 -right-2 text-yellow-300 drop-shadow-md transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-75'
            }`} 
          />
        </div>
        
        <span className="relative font-semibold drop-shadow-md">
          Post a Sandwich
        </span>
        
        <PlusCircle 
          size={20} 
          className={`text-white/90 drop-shadow-md transition-transform duration-300 ${
            isHovered ? 'rotate-90 scale-110' : ''
          }`} 
        />
      </div>
      
      {/* Ripple effect on click */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping" />
      )}
    </button>
  );
};

export default SandwichReviewButton;