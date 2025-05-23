"use client";

import React from "react";
import { motion } from "framer-motion";

type FormStepProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormStep({ title, description, children }: FormStepProps) {
  return (
    <div className="mb-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 px-4"
      >
        <h2 className="text-xl font-bold text-[#191310]">{title}</h2>
        <p className="text-[#8c6a5a] text-sm">{description}</p>
      </motion.div>
      
      <div className="bg-white rounded-xl shadow-sm border border-[#e3d9d3] mb-6">
        {children}
      </div>
    </div>
  );
}