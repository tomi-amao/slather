"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { UploadButton } from "@/lib/uploadthing"
import { Header } from "@/components/header"
import Image from "next/image"

export default function CreateSandwichPage() {
  const router = useRouter()
  // Keeping useSession hook for future use but ignoring the unused variables
  useSession()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "RESTAURANT" as "RESTAURANT" | "HOMEMADE",
    restaurantName: "",
    ingredients: "",
    overallRating: "",
    tasteRating: "",
    textureRating: "",
    presentationRating: "",
    images: [] as string[],
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const uploadButtonRef = useRef<HTMLElement | null>(null)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, type: e.target.value as "RESTAURANT" | "HOMEMADE" }))
  }
  
  const validateForm = () => {
    // Clear previous errors
    setError("");
    
    // Basic validations
    if (!formData.title.trim()) {
      setError("Sandwich name is required");
      return false;
    }
    
    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters");
      return false;
    }
    
    if (formData.type === "RESTAURANT" && !formData.restaurantName.trim()) {
      setError("Restaurant name is required");
      return false;
    }
    
    if (formData.type === "HOMEMADE" && !formData.ingredients.trim()) {
      setError("Please list the ingredients used in your sandwich");
      return false;
    }
    
    if (!formData.overallRating || !formData.tasteRating || !formData.textureRating || !formData.presentationRating) {
      setError("Please provide ratings for all categories");
      return false;
    }
    
    if (formData.images.length === 0) {
      setError("Please upload at least one image of your sandwich");
      return false;
    }
    
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (status !== "authenticated") {
    //   setError("You must be logged in to create a sandwich");
    //   return;
    // }
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Convert rating strings to numbers for the API
      const submissionData = {
        ...formData,
        overallRating: formData.overallRating,
        tasteRating: formData.tasteRating,
        textureRating: formData.textureRating,
        presentationRating: formData.presentationRating,
      };
      
      const response = await fetch("/api/sandwiches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || "Failed to create sandwich";
        if (data.details && Array.isArray(data.details)) {
          // Format validation errors
          const validationErrors = data.details.map((issue: { message: string }) => issue.message).join(", ");
          throw new Error(`${errorMessage}: ${validationErrors}`);
        }
        throw new Error(errorMessage);
      }
      
      // Show success message and redirect to the sandwich page
      console.log("Sandwich created successfully:", data.sandwich);
      router.push(`/sandwich/${data.sandwich.id}`);
      router.refresh();
    } catch (err) {
      console.error("Error creating sandwich:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Rating options
  const ratingOptions = [
    { value: "", label: "Select a rating" },
    { value: "5", label: "5 - Outstanding" },
    { value: "4", label: "4 - Very Good" },
    { value: "3", label: "3 - Good" },
    { value: "2", label: "2 - Fair" },
    { value: "1", label: "1 - Poor" },
  ]
  
  // Handle drag events for custom dropzone
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    // Find the hidden file input from UploadThing and trigger it with the dropped files
    const uploadButtonInput = document.querySelector('.uploadthing-button input[type="file"]') as HTMLInputElement
    
    if (uploadButtonInput && e.dataTransfer.files.length > 0) {
      // Create a new DataTransfer object
      const dataTransfer = new DataTransfer()
      
      // Add all dropped files to the DataTransfer object
      Array.from(e.dataTransfer.files).forEach(file => {
        dataTransfer.items.add(file)
      })
      
      // Set the files to the input and dispatch change event
      uploadButtonInput.files = dataTransfer.files
      
      // Trigger change event to make UploadThing handle the files
      const changeEvent = new Event('change', { bubbles: true })
      uploadButtonInput.dispatchEvent(changeEvent)
    }
  }, [])

  // Effect to store a reference to the upload button after component mounts
  useEffect(() => {
    uploadButtonRef.current = document.querySelector('.uploadthing-button input[type="file"]')
  }, [])
  
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#191310] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Share Your Sandwich Experience
              </p>
            </div>
            
            {error && (
              <div className="flex max-w-[480px] mx-4 mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Sandwich Name</p>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., The Classic Reuben"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Description</p>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your sandwich experience in detail. Include the taste, texture, and overall satisfaction."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none min-h-36 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>
            
            <h3 className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Sandwich Origin
            </h3>
            <div className="flex flex-col gap-3 p-4">
              <label className="flex items-center gap-4 rounded-xl border border-solid border-[#e3d9d3] p-[15px]">
                <input
                  type="radio"
                  name="type"
                  value="RESTAURANT"
                  checked={formData.type === "RESTAURANT"}
                  onChange={handleRadioChange}
                  className="h-5 w-5 border-2 border-[#e3d9d3] bg-transparent text-transparent checked:border-[#eccebf] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#eccebf]"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#191310] text-sm font-medium leading-normal">Restaurant</p>
                </div>
              </label>
              <label className="flex items-center gap-4 rounded-xl border border-solid border-[#e3d9d3] p-[15px]">
                <input
                  type="radio"
                  name="type"
                  value="HOMEMADE"
                  checked={formData.type === "HOMEMADE"}
                  onChange={handleRadioChange}
                  className="h-5 w-5 border-2 border-[#e3d9d3] bg-transparent text-transparent checked:border-[#eccebf] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#eccebf]"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#191310] text-sm font-medium leading-normal">Homemade</p>
                </div>
              </label>
            </div>
            
            {formData.type === "RESTAURANT" && (
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#191310] text-base font-medium leading-normal pb-2">Restaurant Name</p>
                  <input
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleInputChange}
                    placeholder="Name of the restaurant where you had the sandwich"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  />
                </label>
              </div>
            )}
            
            {formData.type === "HOMEMADE" && (
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#191310] text-base font-medium leading-normal pb-2">Ingredients</p>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    placeholder="List all the ingredients used in your homemade sandwich"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none min-h-36 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  />
                </label>
              </div>
            )}
            
            <h3 className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Rate Your Sandwich
            </h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Overall Rating</p>
                <select
                  name="overallRating"
                  value={formData.overallRating}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 bg-[image:--select-button-svg] placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Taste</p>
                <select
                  name="tasteRating"
                  value={formData.tasteRating}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 bg-[image:--select-button-svg] placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Texture</p>
                <select
                  name="textureRating"
                  value={formData.textureRating}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 bg-[image:--select-button-svg] placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Presentation</p>
                <select
                  name="presentationRating"
                  value={formData.presentationRating}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 bg-[image:--select-button-svg] placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <h3 className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Upload Photos
            </h3>
            <div className="flex flex-col items-center px-4 py-3">
              {/* Display already uploaded images */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4 w-full">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image 
                        src={imageUrl} 
                        alt={`Sandwich image ${index + 1}`} 
                        className="h-24 w-24 object-cover rounded-lg"
                        width={96}
                        height={96}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload controls - show only if less than 5 images uploaded */}
              {formData.images.length < 5 && (
                <div className="w-full max-w-[480px]">
                  <div className="flex flex-col items-center gap-2 mx-auto mb-4">
                    <p className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em] text-center">
                      Share photos of your sandwich
                    </p>
                    <p className="text-[#8c6a5a] text-sm font-normal leading-normal text-center">
                      Upload up to 5 photos ({formData.images.length}/5 uploaded)
                    </p>
                  </div>
                  
                  {/* Custom dropzone that visually communicates functionality */}
                  <div 
                    className={`w-full p-6 mb-6 border-2 ${isDragging ? 'border-[#eccebf] bg-[#faf7f5]' : 'border-dashed border-[#e3d9d3]'} rounded-xl transition-colors flex flex-col items-center justify-center cursor-pointer`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      // Find and click the hidden upload button
                      const uploadButtonInput = document.querySelector('.uploadthing-button input')
                      if (uploadButtonInput instanceof HTMLElement) {
                        uploadButtonInput.click()
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f1ece9] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8c6a5a">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                          <line x1="16" y1="5" x2="22" y2="5"></line>
                          <line x1="19" y1="2" x2="19" y2="8"></line>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-[#191310] text-sm font-medium">Drag and drop or click to upload</p>
                        <p className="text-[#8c6a5a] text-xs mt-1">Supports JPEG, PNG, WebP (Max 4MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Styled UploadButton that handles actual uploads */}
                  <div className="flex justify-center">
                    <UploadButton
                      endpoint="sandwichImageUploader"
                      onClientUploadComplete={(res) => {
                        // Extract URLs from the response and add to form data
                        const newImages = res.map(file => file.url);
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, ...newImages].slice(0, 5) // Limit to 5 images
                        }));
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Upload error:", error);
                        setError(`Error uploading image: ${error.message}`);
                      }}
                      className="uploadthing-button ut-button:bg-[#eccebf] ut-button:text-[#191310] ut-button:rounded-full ut-button:font-bold ut-button:text-sm ut-button:px-6 ut-button:py-2 ut-button:cursor-pointer ut-button:transition-colors ut-button:hover:bg-[#e3c0a9] ut-allowed-content:flex ut-allowed-content:flex-col ut-allowed-content:items-center ut-allowed-content:gap-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex px-4 py-3 justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 hover:bg-[#e3c0a9] transition-colors"
              >
                <span className="truncate">
                  {isSubmitting ? "Submitting..." : "Submit Sandwich"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}