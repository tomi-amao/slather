"use client";

import React, { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type IngredientTagsProps = {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
};

export function IngredientTags({ ingredients, onChange }: IngredientTagsProps) {
  const [inputValue, setInputValue] = useState("");
  
  // Common sandwich ingredients for suggestions
  const suggestions = [
    "Bread", "Turkey", "Ham", "Cheese", "Lettuce", "Tomato", 
    "Mayo", "Mustard", "Avocado", "Bacon", "Pickles", "Onion", 
    "Cucumber", "Peppers", "Hummus", "Peanut Butter", "Jelly"
  ].filter(item => !ingredients.includes(item));
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addIngredient(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue) {
      // Remove the last ingredient when backspace is pressed in an empty input
      if (ingredients.length) {
        const newIngredients = [...ingredients];
        newIngredients.pop();
        onChange(newIngredients);
      }
    }
  };
  
  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      onChange([...ingredients, ingredient]);
      setInputValue("");
    }
  };
  
  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    onChange(newIngredients);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-3 bg-[#f1ece9] rounded-xl min-h-14">
        <AnimatePresence>
          {ingredients.map((ingredient, index) => (
            <motion.div 
              key={ingredient}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#eccebf] text-[#191310] px-3 py-1 rounded-full flex items-center"
            >
              <span className="mr-1">{ingredient}</span>
              <button 
                type="button" 
                onClick={() => removeIngredient(index)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#191310] hover:bg-[#e3c0a9] transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ingredients.length ? "Add more ingredients..." : "Type an ingredient and press Enter..."}
          className="flex-grow bg-transparent border-none outline-none min-w-[150px] h-8 placeholder:text-[#8c6a5a] text-[#191310]"
        />
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-[#8c6a5a] mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 8).map((suggestion) => (
              <motion.button
                key={suggestion}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f1ece9] text-[#8c6a5a] px-3 py-1 rounded-full text-sm hover:bg-[#e3d9d3] transition-colors"
                onClick={() => addIngredient(suggestion)}
              >
                + {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-[#8c6a5a] mt-2">
        Press Enter to add an ingredient, or click a suggestion
      </p>
    </div>
  );
}