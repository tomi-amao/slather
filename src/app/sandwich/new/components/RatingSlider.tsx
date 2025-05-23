"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type RatingSliderProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
};

export function RatingSlider({ value, onChange, label, className = "" }: RatingSliderProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  
  // Emoji mapping for ratings
  const emojis = ["😞", "😕", "😐", "🙂", "😋"];
  
  // Description mapping for ratings
  const descriptions = [
    "Poor - Not worth trying",
    "Fair - Below average",
    "Good - Acceptable",
    "Very Good - Above average",
    "Outstanding - Must try!"
  ];
  
  const handleClick = (newValue: number) => {
    onChange(newValue.toString());
  };
  
  const activeValue = hoveredValue !== null ? hoveredValue : parseInt(value);
  
  return (
    <div className={`w-full max-w-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#191310] font-medium">{label}</span>
        <span className="text-xl">{emojis[activeValue - 1]}</span>
      </div>
      
      <div className="relative mb-1">
        <div className="h-2 bg-[#f1ece9] rounded-full w-full">
          <motion.div 
            className="h-full bg-[#eccebf] rounded-full"
            initial={{ width: `${parseInt(value) * 20}%` }}
            animate={{ width: `${activeValue * 20}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center -ml-4 first:ml-0 last:ml-0 focus:outline-none transition-all ${
                num <= activeValue ? 'bg-[#eccebf] text-[#191310] scale-110' : 'bg-[#f1ece9] text-[#8c6a5a]'
              }`}
              onClick={() => handleClick(num)}
              onMouseEnter={() => setHoveredValue(num)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      <motion.p 
        key={activeValue}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#8c6a5a] text-sm mt-2 min-h-[20px]"
      >
        {descriptions[activeValue - 1]}
      </motion.p>
    </div>
  );
}