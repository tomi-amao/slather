"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Header } from "@/components/header"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

// Custom components for our enhanced form
import { RatingSlider } from "./components/RatingSlider"
import { CustomDropdown } from "./components/CustomDropdown"
import { FormStep } from "./components/FormStep"
import { IngredientTags } from "./components/IngredientTags"
import { SandwichTypeSelector } from "./components/SandwichTypeSelector"
import { ProgressBar } from "./components/ProgressBar"

export default function CreateSandwichPage() {
  const router = useRouter()
  useSession()
  
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0)
  
  // Form data with default values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "RESTAURANT" as "RESTAURANT" | "HOMEMADE",
    restaurantName: "",
    ingredients: [] as string[],
    price: "", // Add price field
    overallRating: "5.0",
    tasteRating: "5.0",
    textureRating: "5.0",
    presentationRating: "5.0",
    images: [] as string[],
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  // Define form steps for our multi-step form
  const formSteps = [
    { title: "Basics", description: "Let's start with the basics" },
    { title: "Details", description: "Tell us more about your sandwich" },
    { title: "Ratings", description: "How would you rate your sandwich?" },
    { title: "Photos", description: "Show off your sandwich" },
    { title: "Review", description: "Review your submission" }
  ]
  
  // Handle basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle rating changes via sliders
  const handleRatingChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle sandwich type change
  const handleTypeChange = (type: "RESTAURANT" | "HOMEMADE") => {
    setFormData(prev => ({ ...prev, type }))
  }
  
  // Handle ingredients change (for tags)
  const handleIngredientsChange = useCallback(
    (updater: (prevIngredients: string[]) => string[]) => {
      setFormData(prevFormData => {
        const currentIngredients = Array.isArray(prevFormData.ingredients) ? prevFormData.ingredients : [];
        const newIngredients = updater(currentIngredients);
        return { ...prevFormData, ingredients: newIngredients };
      });
    },
    [] // setFormData is stable, so empty deps array is fine.
  );
  
  // Navigate to next step if validation passes
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Navigate to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Validate current step before proceeding
  const validateCurrentStep = () => {
    setError("")
    
    switch (currentStep) {
      case 0: // Basics
        if (!formData.title.trim()) {
          setError("Please enter a sandwich name")
          return false
        }
        if (formData.description.length < 10) {
          setError("Description should be at least 10 characters")
          return false
        }
        return true
        
      case 1: // Details
        if (formData.type === "RESTAURANT" && !formData.restaurantName.trim()) {
          setError("Please enter the restaurant name")
          return false
        }
        if (formData.type === "HOMEMADE" && formData.ingredients.length === 0) {
          setError("Please add at least one ingredient")
          return false
        }
        return true
        
      case 2: // Ratings
        // All ratings have default values, so this should always pass
        return true
        
      case 3: // Photos
        if (formData.images.length === 0) {
          setError("Please upload at least one image of your sandwich")
          return false
        }
        return true
        
      default:
        return true
    }
  }
  
  // Validate entire form before submission
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Sandwich name is required")
      setCurrentStep(0)
      return false
    }
    
    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters")
      setCurrentStep(0)
      return false
    }
    
    if (formData.type === "RESTAURANT" && !formData.restaurantName.trim()) {
      setError("Restaurant name is required")
      setCurrentStep(1)
      return false
    }
    
    if (formData.type === "HOMEMADE" && formData.ingredients.length === 0) {
      setError("Please add at least one ingredient")
      setCurrentStep(1)
      return false
    }
    
    if (formData.images.length === 0) {
      setError("Please upload at least one image of your sandwich")
      setCurrentStep(3)
      return false
    }
    
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      // Format ingredients as comma-separated string if needed
      const ingredientsString = formData.ingredients.join(', ')
      
      const submissionData = {
        ...formData,
        ingredients: ingredientsString
      }
      
      const response = await fetch("/api/sandwiches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const errorMessage = data.error || "Failed to create sandwich"
        if (data.details && Array.isArray(data.details)) {
          const validationErrors = data.details.map((issue: { message: string }) => issue.message).join(", ")
          throw new Error(`${errorMessage}: ${validationErrors}`)
        }
        throw new Error(errorMessage)
      }
      
      // Show success message and redirect to the sandwich page
      toast.success("Sandwich created successfully!")
      router.push(`/sandwich/${data.sandwich.id}`)
      router.refresh()
    } catch (err) {
      console.error("Error creating sandwich:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle image uploads
  const handleImagesUploaded = (newImageUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls].slice(0, 5) // Limit to 5 images
    }))
    
    // Show success toast
    toast.success(`${newImageUrls.length} image${newImageUrls.length === 1 ? '' : 's'} uploaded!`)
  }
  
  // Remove an image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  // Framer Motion variants for animations
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }
  
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-12 lg:px-40 flex flex-1 justify-center py-5"
      >
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 relative">
          <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
            <h1 className="text-[#191310] tracking-light text-[32px] font-bold leading-tight min-w-72">
              Share Your Sandwich Experience
            </h1>
          </div>
          
          {/* Progress bar */}
          <div className="mb-8 px-4">
            <ProgressBar 
              steps={formSteps} 
              currentStep={currentStep} 
              onStepClick={(step: number) => {
                // Only allow going back or to validated steps
                if (step <= currentStep) {
                  setCurrentStep(step)
                }
              }}
            />
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex max-w-[480px] mx-4 mb-4 p-4 bg-red-50 text-red-700 rounded-xl"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ type: "tween", duration: 0.3 }}
                className="flex-1"
              >
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <FormStep title={formSteps[0].title} description={formSteps[0].description}>
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                      <label className="flex flex-col min-w-40 flex-1">
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-[#191310] text-base font-medium leading-normal pb-2"
                        >
                          What's your sandwich called?
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., The Classic Reuben"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                            required
                          />
                        </motion.div>
                      </label>
                    </div>
                    
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                      <label className="flex flex-col min-w-40 flex-1">
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-[#191310] text-base font-medium leading-normal pb-2"
                        >
                          Describe your sandwich experience
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your sandwich experience in detail. Include the taste, texture, and overall satisfaction."
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none min-h-36 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                            required
                          />
                        </motion.div>
                      </label>
                    </div>
                  </FormStep>
                )}
                
                {/* Step 2: Details */}
                {currentStep === 1 && (
                  <FormStep title={formSteps[1].title} description={formSteps[1].description}>
                    <div className="px-4 py-3">
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#191310] text-base font-medium leading-normal pb-2"
                      >
                        Where did your sandwich come from?
                      </motion.p>
                      
                      <SandwichTypeSelector 
                        selected={formData.type} 
                        onChange={handleTypeChange} 
                      />
                    </div>
                    
                    {formData.type === "RESTAURANT" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 overflow-hidden"
                      >
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#191310] text-base font-medium leading-normal pb-2">
                            Restaurant Name
                          </p>
                          <CustomDropdown
                            name="restaurantName"
                            value={formData.restaurantName}
                            onChange={handleInputChange}
                            placeholder="Name of the restaurant where you had the sandwich"
                            suggestions={["McDonald's", "Subway", "Panera Bread", "Jimmy John's", "Jersey Mike's"]}
                            allowCustomInput={true}
                          />
                        </label>
                      </motion.div>
                    )}
                    
                    {/* Price input - appears for both restaurant and homemade */}
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 overflow-hidden"
                    >
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#191310] text-base font-medium leading-normal pb-2">
                          Price {formData.type === "HOMEMADE" ? "(estimated cost)" : ""} (optional)
                        </p>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8c6a5a] text-base">£</span>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] pl-8 pr-4 py-4 text-base font-normal leading-normal"
                          />
                        </div>
                      </label>
                    </motion.div>
                    
                    {formData.type === "HOMEMADE" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 overflow-visible"
                        style={{ overflow: 'visible' }}
                      >
                        <label className="flex flex-col min-w-40 flex-1 overflow-visible">
                          <p className="text-[#191310] text-base font-medium leading-normal pb-2">
                            What ingredients did you use?
                          </p>
                          <IngredientTags
                            ingredients={formData.ingredients}
                            onChange={handleIngredientsChange}
                          />
                        </label>
                      </motion.div>
                    )}
                  </FormStep>
                )}
                
                {/* Step 3: Ratings */}
                {currentStep === 2 && (
                  <FormStep title={formSteps[2].title} description={formSteps[2].description}>
                    <div className="px-4 py-3">
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#191310] text-base font-medium leading-normal pb-2"
                      >
                        Rate your overall experience
                      </motion.p>
                      
                      <RatingSlider
                        name="overallRating"
                        value={formData.overallRating}
                        onChange={(value: string) => handleRatingChange("overallRating", value)}
                        label="Overall Rating"
                        className="mb-8"
                      />
                      
                      <RatingSlider
                        name="tasteRating"
                        value={formData.tasteRating}
                        onChange={(value: string) => handleRatingChange("tasteRating", value)}
                        label="Taste"
                        className="mb-8"
                      />
                      
                      <RatingSlider
                        name="textureRating"
                        value={formData.textureRating}
                        onChange={(value: string) => handleRatingChange("textureRating", value)}
                        label="Texture"
                        className="mb-8"
                      />
                      
                      <RatingSlider
                        name="presentationRating"
                        value={formData.presentationRating}
                        onChange={(value: string) => handleRatingChange("presentationRating", value)}
                        label="Presentation"
                      />
                    </div>
                  </FormStep>
                )}
                
                {/* Step 4: Photos */}
                {currentStep === 3 && (
                  <FormStep title={formSteps[3].title} description={formSteps[3].description}>
                    <div className="flex flex-col items-center px-4 py-3">
                      {/* Display already uploaded images */}
                      {formData.images.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 w-full"
                        >
                          {formData.images.map((imageUrl, index) => (
                            <motion.div 
                              key={index} 
                              className="relative group"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="aspect-square relative rounded-lg overflow-hidden">
                                <Image 
                                  src={imageUrl} 
                                  alt={`Sandwich image ${index + 1}`} 
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Upload controls - show only if less than 5 images uploaded */}
                      {formData.images.length < 5 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="w-full max-w-[480px]"
                        >
                          <div className="flex flex-col items-center gap-2 mx-auto mb-4">
                            <p className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em] text-center">
                              Share photos of your sandwich
                            </p>
                            <p className="text-[#8c6a5a] text-sm font-normal leading-normal text-center">
                              Upload up to 5 photos ({formData.images.length}/5 uploaded)
                            </p>
                          </div>
                          
                          {/* UploadDropzone with progress */}
                          <div className="flex justify-center">
                            <UploadDropzone
                              endpoint="sandwichImageUploader"
                              onClientUploadComplete={(res) => {
                                // Extract URLs from the response and add to form data
                                const newImages = res.map(file => file.url);
                                handleImagesUploaded(newImages);
                                setIsUploading(false);
                                setUploadProgress(0);
                              }}
                              onUploadBegin={() => {
                                setIsUploading(true);
                                setUploadProgress(0);
                              }}
                              onUploadProgress={(progress: number) => {
                                setUploadProgress(progress);
                              }}
                              onUploadError={(error: Error) => {
                                console.error("Upload error:", error);
                                setError(`Error uploading image: ${error.message}`);
                                toast.error(`Upload error: ${error.message}`);
                                setIsUploading(false);
                                setUploadProgress(0);
                              }}
                              config={{
                                mode: "auto"
                              }}
                              appearance={{
                                button: {
                                  background: "#eccebf",
                                  color: "#191310",
                                  borderRadius: "9999px",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  padding: "8px 24px",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                },
                                allowedContent: {
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "4px",
                                },
                                container: {
                                  border: "2px dashed #e3d9d3",
                                  borderRadius: "12px",
                                  padding: "24px",
                                  backgroundColor: isUploading ? "#faf7f5" : "transparent",
                                  transition: "all 0.2s"
                                }
                              }}
                            />
                          </div>

                          {/* Upload Progress */}
                          {isUploading && uploadProgress > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 space-y-2"
                            >
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-[#191310] truncate">
                                    Uploading image...
                                  </span>
                                  <span className="text-xs text-[#8c6a5a">
                                    {Math.round(uploadProgress)}%
                                  </span>
                                </div>
                                <div className="w-full bg-[#f1ece9] rounded-full h-2">
                                  <motion.div 
                                    className="bg-[#eccebf] h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </FormStep>
                )}
                
                {/* Step 5: Review */}
                {currentStep === 4 && (
                  <FormStep title={formSteps[4].title} description={formSteps[4].description}>
                    <div className="px-4 py-3">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#faf7f5] rounded-xl p-6"
                      >
                        <h3 className="text-xl font-bold mb-4">Review Your Sandwich</h3>
                        
                        {/* Preview of sandwich image */}
                        {formData.images.length > 0 && (
                          <div className="mb-6 aspect-video relative rounded-xl overflow-hidden">
                            <Image
                              src={formData.images[0]}
                              alt={formData.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#8c6a5a]">Sandwich Name</h4>
                            <p className="text-lg font-medium">{formData.title}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#8c6a5a]">Description</h4>
                            <p className="text-base">{formData.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#8c6a5a]">Type</h4>
                            <p className="text-base">{formData.type === "RESTAURANT" ? "Restaurant" : "Homemade"}</p>
                          </div>
                          
                          {formData.type === "RESTAURANT" && (
                            <div>
                              <h4 className="text-sm font-medium text-[#8c6a5a]">Restaurant</h4>
                              <p className="text-base">{formData.restaurantName}</p>
                            </div>
                          )}
                          
                          {formData.type === "HOMEMADE" && (
                            <div>
                              <h4 className="text-sm font-medium text-[#8c6a5a]">Ingredients</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {formData.ingredients.map((ingredient, i) => (
                                  <span key={i} className="bg-[#eccebf] text-[#191310] text-xs font-medium px-2 py-1 rounded-full">
                                    {ingredient}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {formData.price && (
                            <div>
                              <h4 className="text-sm font-medium text-[#8c6a5a]">Price</h4>
                              <p className="text-base">${parseFloat(formData.price).toFixed(2)}</p>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#8c6a5a]">Ratings</h4>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div>
                                <span className="text-xs text-[#8c6a5a]">Overall:</span> 
                                <span className="ml-1 font-medium">{parseFloat(formData.overallRating).toFixed(1)} / 10</span>
                              </div>
                              <div>
                                <span className="text-xs text-[#8c6a5a]">Taste:</span> 
                                <span className="ml-1 font-medium">{parseFloat(formData.tasteRating).toFixed(1)} / 10</span>
                              </div>
                              <div>
                                <span className="text-xs text-[#8c6a5a]">Texture:</span> 
                                <span className="ml-1 font-medium">{parseFloat(formData.textureRating).toFixed(1)} / 10</span>
                              </div>
                              <div>
                                <span className="text-xs text-[#8c6a5a]">Presentation:</span> 
                                <span className="ml-1 font-medium">{parseFloat(formData.presentationRating).toFixed(1)} / 10</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#8c6a5a]">Photos</h4>
                            <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                              {formData.images.map((url, i) => (
                                <div key={i} className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden relative">
                                  <Image src={url} alt={`Sandwich ${i+1}`} fill className="object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </FormStep>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="flex px-4 py-6 justify-between">
              {currentStep > 0 && (
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1ece9] text-[#191310] text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#e3d9d3] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="truncate">Back</span>
                </motion.button>
              )}
              
              {currentStep < formSteps.length - 1 ? (
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  className="flex min-w-[84px] ml-auto cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e3c0a9] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="truncate">Continue</span>
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-w-[84px] ml-auto cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 hover:bg-[#e3c0a9] transition-colors"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  <span className="truncate">
                    {isSubmitting ? "Submitting..." : "Submit Sandwich"}
                  </span>
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}