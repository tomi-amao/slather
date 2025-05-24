"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

type RatingSliderProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
};

export function RatingSlider({ value, onChange, label, className = "" }: RatingSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Emoji mapping for ratings (10 levels)
  const emojis = ["😞", "😔", "😕", "😐", "🙂", "😊", "😄", "😍", "🤩", "😋"];
  
  // Description mapping for ratings (10 levels)
  const descriptions = [
    "Terrible - Avoid at all costs",
    "Very Poor - Major issues", 
    "Poor - Not recommended",
    "Below Average - Disappointing",
    "Average - Okay, nothing special",
    "Above Average - Pretty good",
    "Good - Recommended",
    "Very Good - Excellent choice",
    "Outstanding - Amazing experience",
    "Perfect - Absolutely incredible!"
  ];
  
  const numericValue = parseFloat(value);
  const emojiIndex = Math.min(Math.floor(numericValue) - 1, 9);
  
  const handleSliderInteraction = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = 1 + (percentage * 9); // Scale from 1 to 10
    const roundedValue = Math.round(newValue * 10) / 10; // Round to 1 decimal place
    
    onChange(roundedValue.toString());
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderInteraction(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderInteraction(e.clientX);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSliderInteraction(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderInteraction(e.touches[0].clientX);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newValue = 1 + (percentage * 9); // Scale from 1 to 10
        const roundedValue = Math.round(newValue * 10) / 10; // Round to 1 decimal place
        onChange(roundedValue.toString());
      }
    };
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, onChange]);
  
  const progressPercentage = ((numericValue - 1) / 9) * 100;
  
  return (
    <div className={`w-full max-w-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#191310] font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{emojis[emojiIndex]}</span>
          <span className="text-lg font-bold text-[#191310] min-w-[40px] text-right">
            {numericValue.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="relative mb-3">
        <div 
          ref={sliderRef}
          className="h-3 bg-[#f1ece9] rounded-full w-full cursor-pointer relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div 
            className="h-full bg-[#eccebf] rounded-full"
            initial={{ width: `${progressPercentage}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {/* Slider thumb */}
          <motion.div
            className="absolute top-1/2 w-5 h-5 bg-[#191310] rounded-full transform -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-md"
            style={{ left: `${progressPercentage}%`, marginLeft: '-10px' }}
            animate={{ left: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        </div>
        
        {/* Scale markers */}
        <div className="flex justify-between mt-2 px-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              className="text-xs text-[#8c6a5a] hover:text-[#191310] transition-colors cursor-pointer"
              onClick={() => onChange(num.toString())}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      <motion.p 
        key={emojiIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#8c6a5a] text-sm mt-2 min-h-[20px]"
      >
        {descriptions[emojiIndex]}
      </motion.p>
    </div>
  );
}