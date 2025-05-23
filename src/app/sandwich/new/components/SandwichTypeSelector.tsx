"use client";

import React from "react";
import { motion } from "framer-motion";

type SandwichTypeSelectorProps = {
  selected: "RESTAURANT" | "HOMEMADE";
  onChange: (type: "RESTAURANT" | "HOMEMADE") => void;
};

export function SandwichTypeSelector({ selected, onChange }: SandwichTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex flex-col items-center p-6 rounded-xl cursor-pointer transition-colors ${
          selected === "RESTAURANT" 
            ? "bg-[#eccebf] border-2 border-[#eccebf]" 
            : "bg-white border-2 border-[#e3d9d3]"
        }`}
        onClick={() => onChange("RESTAURANT")}
      >
        <div className="absolute top-3 right-3">
          <div 
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selected === "RESTAURANT" 
                ? "bg-[#191310]" 
                : "border-2 border-[#e3d9d3]"
            }`}
          >
            {selected === "RESTAURANT" && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            )}
          </div>
        </div>
        
        <div className="w-16 h-16 rounded-full bg-[#f1ece9] flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${selected === "RESTAURANT" ? "text-[#191310]" : "text-[#8c6a5a]"}`}>
            <path d="M21 11.5v1a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 1 12.5v-1"></path>
            <path d="M4 11.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5.5"></path>
            <path d="M12 19v-7"></path>
            <path d="M8 19v-7"></path>
            <path d="M16 19v-7"></path>
            <path d="M10 14h4"></path>
          </svg>
        </div>
        
        <h3 className={`text-lg font-medium mb-1 ${selected === "RESTAURANT" ? "text-[#191310]" : "text-[#191310]"}`}>
          Restaurant
        </h3>
        <p className={`text-sm text-center ${selected === "RESTAURANT" ? "text-[#191310]" : "text-[#8c6a5a]"}`}>
          I had this sandwich at a restaurant
        </p>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex flex-col items-center p-6 rounded-xl cursor-pointer transition-colors ${
          selected === "HOMEMADE" 
            ? "bg-[#eccebf] border-2 border-[#eccebf]" 
            : "bg-white border-2 border-[#e3d9d3]"
        }`}
        onClick={() => onChange("HOMEMADE")}
      >
        <div className="absolute top-3 right-3">
          <div 
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selected === "HOMEMADE" 
                ? "bg-[#191310]" 
                : "border-2 border-[#e3d9d3]"
            }`}
          >
            {selected === "HOMEMADE" && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            )}
          </div>
        </div>
        
        <div className="w-16 h-16 rounded-full bg-[#f1ece9] flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${selected === "HOMEMADE" ? "text-[#191310]" : "text-[#8c6a5a]"}`}>
            <path d="M20 9v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path>
            <path d="M3 6h18"></path>
            <path d="M6 6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3"></path>
          </svg>
        </div>
        
        <h3 className={`text-lg font-medium mb-1 ${selected === "HOMEMADE" ? "text-[#191310]" : "text-[#191310]"}`}>
          Homemade
        </h3>
        <p className={`text-sm text-center ${selected === "HOMEMADE" ? "text-[#191310]" : "text-[#8c6a5a]"}`}>
          I made this sandwich myself
        </p>
      </motion.div>
    </div>
  );
}