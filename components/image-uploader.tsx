"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2, AlertTriangle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { predictDisease } from "@/lib/api"
import ResultDisplay from "./result-display"

// Define the structure for individual predictions (should match api.ts / result-display.tsx)
interface Prediction {
  label: string;
  score: number;
}

// Define the structure for the result state, matching ResultDisplay props
interface DisplayResult {
  topPrediction: Prediction | null;
  allPredictions: Prediction[];
  rawText?: string;
}

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Update result state type
  const [result, setResult] = useState<DisplayResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await predictDisease(selectedImage)
      
      if (response.status === "error") {
        setError(response.error || "Failed to connect to the prediction service. Please try again later.")
        setIsLoading(false);
        return
      }
      
      if (response.status === "success" && response.topPrediction) {
        setResult({
          topPrediction: response.topPrediction,
          allPredictions: response.allPredictions,
          rawText: response.rawText
        })
      } else {
        // Clearer error message when parsing fails or topPrediction is missing
        setError("Received response, but failed to extract prediction details. Please try again.")
        console.warn("Received success status but issue with prediction data:", response);
      }
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message || 'Unknown client error'}`)
      console.error("handleSubmit Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
      <>
        <div
          className={`border-2 border-dashed rounded-lg p-6 ${
            imagePreview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-green-400"
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          {!imagePreview ? (
            <div className="text-center py-8">
              <Upload className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Rice Leaf Image</h3>
              <p className="text-sm text-gray-500 mb-4">Drag and drop an image here, or click to select a file</p>
              <p className="text-xs text-gray-400">Supported formats: JPG, PNG, JPEG (Max size: 5MB)</p>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md h-64 mx-auto mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Rice leaf preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubmit()
                  }}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Image"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Analysis Error</h4> 
              <p>{error}</p>
              <p className="mt-2 text-xs text-red-600">
                Note: If the service is waking up, it may take 1-2 minutes. Please try again.
              </p>
            </div>
          </div>
        )}

        {result && result.topPrediction && (
          <ResultDisplay 
            topPrediction={result.topPrediction} 
            allPredictions={result.allPredictions}
            rawText={result.rawText} 
          />
        )}
      </>
    </div>
  )
}

