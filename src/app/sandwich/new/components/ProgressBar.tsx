"use client";

import React from "react";
import { motion } from "framer-motion";

type Step = {
  title: string;
  description: string;
};

type ProgressBarProps = {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
};

export function ProgressBar({ steps, currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Mobile view - simple progress bar */}
      <div className="flex items-center md:hidden mb-2">
        <div className="grow h-2 bg-[#f1ece9] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#eccebf]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <span className="ml-3 text-sm font-medium text-[#8c6a5a]">
          {currentStep + 1}/{steps.length}
        </span>
      </div>
      
      {/* Desktop view - stepped progress bar */}
      <ol className="hidden md:flex items-center w-full">
        {steps.map((step, index) => (
          <li 
            key={index} 
            className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}
            onClick={() => onStepClick && onStepClick(index)}
          >
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={index <= currentStep ? { scale: 1.1 } : {}}
                whileTap={index <= currentStep ? { scale: 0.95 } : {}}
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  index < currentStep 
                    ? 'bg-[#eccebf] text-[#191310]' 
                    : index === currentStep
                      ? 'bg-[#eccebf] border-4 border-[#f1ece9] text-[#191310]' 
                      : 'bg-[#f1ece9] text-[#8c6a5a]'
                } ${index <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={index > currentStep}
              >
                {index < currentStep ? (
                  <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </motion.button>
              
              {index <= currentStep && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute mt-12 text-xs font-medium text-center text-[#191310] whitespace-nowrap"
                >
                  {step.title}
                </motion.span>
              )}
            </div>
            
            {index !== steps.length - 1 && (
              <div className="w-full">
                <div className="h-0.5 w-full bg-[#f1ece9]">
                  {index < currentStep && (
                    <motion.div 
                      className="h-full bg-[#eccebf]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                    />
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Current step title (mobile) */}
    </div>
  );
}