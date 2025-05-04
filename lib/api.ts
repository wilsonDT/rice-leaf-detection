// API functions for the rice leaf detection app

// Re-define shared interfaces (can be moved to a types file later)
interface Prediction {
  label: string;
  score: number; // Confidence score (0-1)
}

interface PredictionSuccessResponse {
  topPrediction: Prediction;
  allPredictions: Prediction[];
  status: "success";
  rawText?: string;
}

interface PredictionErrorResponse {
  topPrediction: null;
  allPredictions: [];
  status: "error";
  error: string;
  rawText?: string;
}

type PredictionResponse = PredictionSuccessResponse | PredictionErrorResponse;

/**
 * Convert a file to base64
 * 
 * @param file - The file to convert
 * @returns Promise with the base64 string (data only, without prefix)
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Strip the "data:image/...;base64," part
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Send image to internal API route which will call the Gradio Space
 * 
 * @param image - The image file to analyze
 * @returns Promise with the structured prediction results
 */
export async function predictDisease(image: File): Promise<PredictionResponse> {
  try {
    console.log("Sending image to API route:", image.name, image.type, image.size);
    
    // Convert image to base64 for the API route
    const base64Image = await fileToBase64(image);
    
    // Call our internal API route
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      let errorData;
      let errorText = `API Route error: ${response.status} ${response.statusText}`; // Default text
      try {
          errorData = await response.json();
          if (errorData?.error) {
            errorText = errorData.error; // Use error from JSON if available
          }
      } catch { 
          // If JSON parsing fails, try to get plain text
          try {
             errorText = await response.text();
          } catch (textError) {
             console.error("Failed to get error text from response", textError);
             // Keep the default errorText based on status code
          }
      }
      throw new Error(errorText);
    }

    // Parse the structured response from the API route
    const result = await response.json() as PredictionResponse;
    console.log("Received from API route:", result);
    
    // The API route should return the correct PredictionResponse structure
    return result;

  } catch (error: unknown) {
    console.error("Error calling /api/classify:", error);
    
    // Perform type check for error message
    let message = 'Network error or API route failure';
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    // Return structured error
    return {
      topPrediction: null,
      allPredictions: [],
      status: "error",
      error: `Failed to get prediction: ${message}`,
      rawText: `Client-side error: ${message}`
    };
  }
} 