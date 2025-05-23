"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CustomDropdownProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  suggestions: string[];
  allowCustomInput?: boolean;
};

export function CustomDropdown({
  name,
  value,
  onChange,
  placeholder,
  suggestions,
  allowCustomInput = true,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter suggestions based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredSuggestions(suggestions);
      return;
    }

    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [inputValue, suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Only open dropdown if there's input or allowCustomInput is true
    if (e.target.value || allowCustomInput) {
      setIsOpen(true);
    }
    
    // Create a synthetic event for the parent component
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setIsOpen(false);
    
    // Create a synthetic change event
    const syntheticEvent = {
      target: {
        name,
        value: suggestion
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 pr-10 text-base font-normal leading-normal"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6a5a]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            <ul className="py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  whileHover={{ backgroundColor: "#faf7f5" }}
                  className="px-4 py-2 cursor-pointer hover:bg-[#faf7f5] text-[#191310]"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}