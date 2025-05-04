"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

// Import or define the Prediction interface (matching api.ts)
interface Prediction {
  label: string;
  score: number; // Confidence score (0-1)
}

// Updated props to accept structured prediction data
interface ResultDisplayProps {
  topPrediction: Prediction | null; // Can be null if error or parsing failed
  allPredictions: Prediction[];
}

interface DiseaseInfo {
  name: string
  description: string
  treatment: string
  severity: "low" | "medium" | "high"
}

const diseaseDatabase: Record<string, DiseaseInfo> = {
  "Bacterial Leaf Blight": {
    name: "Bacterial Leaf Blight",
    description: "A serious bacterial disease that causes wilting of seedlings and yellowing and drying of leaves.",
    treatment: "Use resistant varieties, practice field sanitation, and apply copper-based bactericides.",
    severity: "high",
  },
  "Brown Spot": {
    name: "Brown Spot",
    description: "Fungal disease causing brown lesions with gray centers on leaves, reducing photosynthesis.",
    treatment: "Apply fungicides, ensure proper nutrition, and practice crop rotation.",
    severity: "medium",
  },
  "Healthy Rice Leaf": {
    name: "Healthy Rice Leaf",
    description: "No disease detected. The rice plant appears to be in good health.",
    treatment: "Continue regular maintenance and monitoring.",
    severity: "low",
  },
  "Leaf Blast": {
    name: "Leaf Blast",
    description: "Fungal disease causing diamond-shaped lesions on leaves that can lead to complete drying.",
    treatment: "Use resistant varieties, apply fungicides, and maintain proper water management.",
    severity: "high",
  },
  "Leaf scald": {
    name: "Leaf Scald",
    description: "Fungal disease with characteristic scald-like lesions on leaf tips that progress down the leaf blade.",
    treatment: "Plant resistant varieties, apply fungicides, and practice good field drainage.",
    severity: "medium",
  },
  "Narrow Brown Leaf Spot": {
    name: "Narrow Brown Leaf Spot",
    description: "Fungal disease characterized by narrow, brown lesions parallel to leaf veins.",
    treatment: "Use fungicides, practice crop rotation, and maintain balanced fertilization.",
    severity: "medium",
  },
  "Rice Hispa": {
    name: "Rice Hispa",
    description: "Insect pest that causes whitish streaks on leaves as larvae mine inside leaf tissue.",
    treatment: "Apply appropriate insecticides, remove weeds around rice fields, and avoid over-fertilization with nitrogen.",
    severity: "medium",
  },
  "Sheath Blight": {
    name: "Sheath Blight",
    description: "Fungal disease that initially affects the leaf sheaths near the water line, forming oval lesions that expand upward.",
    treatment: "Use resistant varieties, avoid excessive nitrogen, and apply fungicides during early infection stages.",
    severity: "high",
  },
  Healthy: {
    name: "Healthy",
    description: "No disease detected. The rice plant appears to be in good health.",
    treatment: "Continue regular maintenance and monitoring.",
    severity: "low",
  }
}

export default function ResultDisplay({ topPrediction, allPredictions }: ResultDisplayProps) {
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null)

  useEffect(() => {
    if (!topPrediction) {
        // Handle case where there's no top prediction (e.g., error state)
        setDiseaseInfo(null); // Or set a default error state info
        return;
    }

    // Use topPrediction.label for lookup
    let cleanResult = topPrediction.label.trim();

    // Existing cleanup logic (can be potentially simplified or refined)
    if (cleanResult === "Healthy Rice Leaf") {
      cleanResult = "Healthy Rice Leaf";
    } else if (cleanResult.toLowerCase().includes("leaf scald")) {
      cleanResult = "Leaf scald";
    } else if (cleanResult.toLowerCase().includes("narrow brown")) {
      cleanResult = "Narrow Brown Leaf Spot";
    } else if (cleanResult.toLowerCase().includes("rice hispa")) {
      cleanResult = "Rice Hispa";
    } else if (cleanResult.toLowerCase().includes("sheath blight")) {
      cleanResult = "Sheath Blight";
    } else if (cleanResult.toLowerCase().includes("brown spot")) {
      cleanResult = "Brown Spot";
    } else if (cleanResult.toLowerCase().includes("leaf blast")) {
      cleanResult = "Leaf Blast";
    } else if (cleanResult.toLowerCase().includes("bacterial")) {
      cleanResult = "Bacterial Leaf Blight";
    } else if (cleanResult.toLowerCase() === "healthy") {
      cleanResult = "Healthy"; // Match the "Healthy" key
    }


    // Find the disease in our database or use a default
    const foundDisease = diseaseDatabase[cleanResult] || {
      name: cleanResult, // Use the predicted label even if not in DB
      description: "Information about this disease is not available in our database.",
      treatment: "Consult with an agricultural expert for proper treatment options.",
      severity: "medium" as const, // Default severity
    }

    setDiseaseInfo(foundDisease)
  }, [topPrediction]) // Depend on topPrediction object

  // If no disease info derived (e.g., initial state or error), don't render
  if (!diseaseInfo || !topPrediction) return null

  const severityColor = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  const severityIcon = {
    low: <CheckCircle className="h-5 w-5 text-green-600" />,
    medium: <Info className="h-5 w-5 text-yellow-600" />,
    high: <AlertCircle className="h-5 w-5 text-red-600" />,
  }

  return (
    <div className="mt-6 bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm">
      {/* Header uses topPrediction.score */}
      <div className="bg-green-50 p-4 border-b border-green-100">
        <h3 className="text-xl font-semibold text-green-900">Analysis Result</h3>
        {topPrediction.score !== undefined && ( // Check score exists
          <p className="text-sm text-green-700 mt-1">
            Confidence: {(topPrediction.score * 100).toFixed(1)}%
          </p>
        )}
      </div>

      <div className="p-5">
        {/* Disease name tag uses derived diseaseInfo */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${severityColor[diseaseInfo.severity]}`}
          >
            {severityIcon[diseaseInfo.severity]}
            {diseaseInfo.name}
          </div>
        </div>

        {/* Model Prediction section uses allPredictions */}
        {allPredictions && allPredictions.length > 0 && (
          <div className="mb-6 border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div className="bg-green-700 text-white text-xs font-medium px-3 py-2 flex items-center">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
              Model Prediction Details
            </div>
             {/* Render the list of predictions */}
             <div className="p-4 bg-gray-50 text-sm text-gray-900 border-t border-gray-200 space-y-1">
                 {allPredictions.map((pred, index) => (
                     <div key={index} className="flex justify-between">
                         <span>{index + 1}. {pred.label}</span>
                         <span className="font-medium">{(pred.score * 100).toFixed(1)}%</span>
                     </div>
                 ))}
            </div>
          </div>
        )}

        {/* Description and Treatment use derived diseaseInfo */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-800">{diseaseInfo.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Recommended Treatment</h4>
            <p className="text-gray-800">{diseaseInfo.treatment}</p>
          </div>

          {/* Important Note section remains the same */}
          <div
            className={`mt-6 p-4 rounded-md ${diseaseInfo.severity === "low"
                ? "bg-green-50 border border-green-100"
                : "bg-yellow-50 border border-yellow-100"
              }`}
          >
            <div className="flex items-start gap-2">
              <Info
                className={`h-5 w-5 mt-0.5 ${diseaseInfo.severity === "low" ? "text-green-600" : "text-yellow-600"}`}
              />
              <div>
                <h4
                  className={`font-medium ${diseaseInfo.severity === "low" ? "text-green-800" : "text-yellow-800"
                    } mb-1`}
                >
                  {diseaseInfo.severity === "low" ? "Good News!" : "Important Note"}
                </h4>
                <p className={`text-sm ${diseaseInfo.severity === "low" ? "text-green-700" : "text-yellow-700"}`}>
                  {diseaseInfo.severity === "low"
                    ? "Your rice plant appears to be healthy. Continue with regular care and monitoring."
                    : "Early detection is crucial. Consider implementing the recommended treatments as soon as possible to prevent spread."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

