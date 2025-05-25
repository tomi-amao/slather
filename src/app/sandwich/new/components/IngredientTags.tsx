"use client";

import React, { useState, KeyboardEvent, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type IngredientTagsProps = {
  ingredients: string[];
  onChange: (updater: (prevIngredients: string[]) => string[]) => void;
};

export function IngredientTags({ ingredients, onChange }: IngredientTagsProps) {
  // Ensure ingredients is always an array to prevent .some() errors
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Comprehensive list of common sandwich ingredients
  const allSuggestions = [
    // Breads
    "White Bread", "Wheat Bread", "Sourdough", "Rye Bread", "Bagel", "Croissant", "Pita", "Ciabatta", "Baguette", "English Muffin",
    // Proteins
    "Turkey", "Ham", "Chicken", "Beef", "Roast Beef", "Pastrami", "Salami", "Pepperoni", "Bacon", "Sausage", 
    "Tuna", "Salmon", "Crab", "Shrimp", "Egg", "Tofu", "Tempeh", "Hummus", "Peanut Butter",
    // Cheeses
    "Cheddar", "Swiss", "American", "Provolone", "Mozzarella", "Gouda", "Brie", "Feta", "Blue Cheese", "Cream Cheese",
    // Vegetables
    "Lettuce", "Spinach", "Arugula", "Tomato", "Cucumber", "Onion", "Red Onion", "Pickles", "Peppers", "Bell Peppers", 
    "Jalapeños", "Avocado", "Sprouts", "Mushrooms", "Olives", "Carrots", "Radish", "Cabbage",
    // Condiments & Spreads
    "Mayo", "Mustard", "Dijon Mustard", "Honey Mustard", "Ketchup", "Ranch", "Italian Dressing", "Vinaigrette", 
    "Pesto", "Aioli", "Chipotle Mayo", "BBQ Sauce", "Hot Sauce", "Sriracha", "Butter", "Olive Oil",
    // Fruits & Sweet
    "Apple", "Banana", "Strawberry", "Grape", "Cranberries", "Jelly", "Jam", "Honey", "Maple Syrup"
  ];
  
  // Normalize ingredient names for comparison (case-insensitive)
  const normalizeIngredient = (ingredient: string) => ingredient.toLowerCase().trim();
  
  // Check if ingredient already exists (case-insensitive)
  const ingredientExists = (ingredient: string) => {
    const normalized = normalizeIngredient(ingredient);
    return safeIngredients.some(existing => normalizeIngredient(existing) === normalized);
  };
  
  // Filter suggestions based on input and exclude already selected ingredients
  const filteredSuggestions = allSuggestions.filter(item => 
    !ingredientExists(item) && 
    item.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  // Show top suggestions when no input, filtered when typing
  const displaySuggestions = inputValue.trim() ? filteredSuggestions.slice(0, 6) : 
    allSuggestions.filter(item => !ingredientExists(item)).slice(0, 8);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addIngredient(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue) {
      // Remove the last ingredient when backspace is pressed in an empty input
      if (safeIngredients.length) {
        onChange((prevIngredients: string[]) => {
          const safePrevIngredients = Array.isArray(prevIngredients) ? prevIngredients : [];
          const newIngredients = [...safePrevIngredients];
          newIngredients.pop();
          return newIngredients;
        });
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsInputFocused(false);
      inputRef.current?.blur();
    }
  };
  
  const addIngredient = useCallback((ingredient: string) => {
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient) {
      // Pass an updater function to the parent
      onChange((prevIngredients: string[]) => {
        const safePrevIngredients = Array.isArray(prevIngredients) ? prevIngredients : [];
        const normalized = trimmedIngredient.toLowerCase().trim();
        const exists = safePrevIngredients.some(existing => existing.toLowerCase().trim() === normalized);
        
        if (!exists) {
          return [...safePrevIngredients, trimmedIngredient];
        }
        return safePrevIngredients;
      });
      setInputValue("");
      setTimeout(() => {
        inputRef.current?.focus();
        setShowSuggestions(true);
      }, 0);
    }
  }, [onChange]);
  
  const removeIngredient = (index: number) => {
    // Pass an updater function to the parent for removal
    onChange((prevIngredients: string[]) => {
      const safePrevIngredients = Array.isArray(prevIngredients) ? prevIngredients : [];
      const newIngredients = [...safePrevIngredients];
      newIngredients.splice(index, 1);
      return newIngredients;
    });
  };

  // Handle input focus
  const handleFocus = () => {
    setIsInputFocused(true);
    setShowSuggestions(true);
  };

  // Handle input blur with proper timing to allow suggestion clicks
  const handleBlur = () => {
    // Check if the blur is happening because user clicked on suggestions
    setTimeout(() => {
      // Only hide if focus didn't move to suggestions container
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setIsInputFocused(false);
        setShowSuggestions(false);
      }
    }, 200);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Handle suggestion click with improved event handling
  const handleSuggestionClick = (suggestion: string, event?: React.MouseEvent) => {
    // Prevent any default behavior and event bubbling
    event?.preventDefault();
    event?.stopPropagation();
    
    addIngredient(suggestion);
    
    // Keep focus on input after clicking suggestion
    setTimeout(() => {
      inputRef.current?.focus();
      setIsInputFocused(true);
      setShowSuggestions(true);
    }, 0);
  };
  
  return (
    <div className="w-full relative">
      <div 
        className="flex flex-wrap gap-2 p-3 bg-[#f1ece9] rounded-xl min-h-14 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {safeIngredients.map((ingredient, index) => (
            <motion.div 
              key={`${ingredient}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-[#eccebf] text-[#191310] px-3 py-1 rounded-full flex items-center"
            >
              <span className="mr-1 text-sm">{ingredient}</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeIngredient(index);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#191310] hover:bg-[#e3c0a9] transition-colors text-xs"
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={safeIngredients.length ? "Add more ingredients..." : "Type an ingredient and press Enter..."}
          className="flex-grow bg-transparent border-none outline-none min-w-[150px] h-8 placeholder:text-[#8c6a5a] text-[#191310] text-sm"
        />
      </div>
      
      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && displaySuggestions.length > 0 && (isInputFocused || inputValue.trim()) && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-[9999] mt-2 bg-white rounded-xl shadow-xl border border-[#e3d9d3] max-h-48 overflow-y-auto"
            style={{
              position: 'absolute',
              zIndex: 9999,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onMouseDown={(e) => {
              // Prevent blur when clicking in suggestions area
              e.preventDefault();
            }}
          >
            <div className="p-2">
              <p className="text-xs text-[#8c6a5a] mb-2 px-2">
                {inputValue.trim() ? "Matching ingredients:" : "Popular ingredients:"}
              </p>
              <div className="space-y-1">
                {displaySuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg text-[#191310] hover:bg-[#faf7f5] transition-colors text-sm focus:bg-[#faf7f5] focus:outline-none"
                    onClick={(e) => handleSuggestionClick(suggestion, e)}
                    onMouseDown={(e) => {
                      // Prevent blur when clicking suggestion
                      e.preventDefault();
                    }}
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-[#8c6a5a] mt-2">
        Type to search ingredients, press Enter to add, or click suggestions above
      </p>
    </div>
  );
}
