import { NextResponse } from 'next/server';
import { Client } from "@gradio/client";

// Define shared interfaces (Ideally import from a shared types file)
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

// --- Parsing logic (moved from lib/api.ts or duplicated/imported) ---
function parseGradioResult(resultText: string): { topPrediction: Prediction | null, allPredictions: Prediction[] } {
  const allPredictions: Prediction[] = [];
  let topPrediction: Prediction | null = null;
  const lines = resultText.trim().split('\n');

  const topPredictionMatch = lines[0]?.match(/Predicted Class: ([^(]+)\s*\(Confidence: ([0-9.]+)%\)/);
  if (topPredictionMatch && topPredictionMatch.length >= 3) {
    const label = topPredictionMatch[1].trim();
    const score = parseFloat(topPredictionMatch[2]) / 100;
    topPrediction = { label, score };
    allPredictions.push(topPrediction);
  }

  const allPredictionsIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith('all predictions:'));
  if (allPredictionsIndex !== -1) {
    for (let i = allPredictionsIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^\d+\.\s*([^:]+):\s*([0-9.]+)%/);
      if (match && match.length >= 3) {
        const label = match[1].trim();
        const score = parseFloat(match[2]) / 100;
        if (!topPrediction || label !== topPrediction.label || Math.abs(score - topPrediction.score) > 1e-6) {
          allPredictions.push({ label, score });
        }
      }
    }
  }

  if (allPredictions.length > 0) {
     allPredictions.sort((a, b) => b.score - a.score);
     topPrediction = allPredictions[0];
  } else if (topPrediction) {
     allPredictions.push(topPrediction);
  }

  if (!topPrediction && allPredictions.length === 0 && resultText.trim()) {
     console.warn("[API Route] Could not parse prediction text:", resultText);
     topPrediction = { label: resultText.trim(), score: 0 };
     allPredictions.push(topPrediction);
  }

  return { topPrediction, allPredictions };
}
// --- End Parsing Logic ---


// Helper function to convert base64 to Blob needed by Gradio client
async function base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}


export async function POST(request: Request): Promise<NextResponse<PredictionSuccessResponse | PredictionErrorResponse>> {
  try {
    const { image: base64Image } = await request.json();

    if (!base64Image) {
      const errorPayload: PredictionErrorResponse = { topPrediction: null, allPredictions: [], status: "error", error: 'No image data provided' };
      return NextResponse.json(errorPayload, { status: 400 });
    }

    console.log("[API Route] Received image data (length):", base64Image.length);

    const mimeType = 'image/jpeg';
    const imageBlob = await base64ToBlob(base64Image, mimeType);

    const client = await Client.connect("wilsondt/rice-disease-classification");
    console.log("[API Route] Calling Gradio predict...");
    const result = await client.predict("/predict", {
      image: imageBlob
    });
    console.log("[API Route] Gradio response data structure:", typeof result.data, Array.isArray(result.data) ? `Array(length=${result.data.length})` : '');
    console.log("[API Route] Gradio response data content:", result.data);


    let resultText: string | null = null;
    if (Array.isArray(result.data) && result.data.length > 0 && typeof result.data[0] === 'string') {
      resultText = result.data[0];
      console.log("[API Route] Extracted string from array element.");
    } else if (typeof result.data === 'string') {
      resultText = result.data;
      console.log("[API Route] Received plain string.");
    }

    if (resultText !== null) {
        const { topPrediction, allPredictions } = parseGradioResult(resultText);

        if (topPrediction) {
            const successResponse: PredictionSuccessResponse = {
                topPrediction: topPrediction,
                allPredictions: allPredictions,
                status: "success",
                rawText: resultText
            };
            return NextResponse.json(successResponse);
        } else {
             console.error("[API Route] Failed to parse prediction text, even with fallback.", resultText);
             const fallbackResponse: PredictionSuccessResponse = {
                 topPrediction: { label: "Error: Could not parse prediction text", score: 0 },
                 allPredictions: [{ label: "Error: Could not parse prediction text", score: 0 }],
                 status: "success",
                 rawText: resultText
             };
            return NextResponse.json(fallbackResponse);
        }

    } else {
        console.error("[API Route] Unexpected Gradio API response data format (not string or array[string]):", result.data);
        const errorResponse: PredictionErrorResponse = {
             topPrediction: null,
             allPredictions: [],
             status: "error",
             error: "Unexpected API response format from Gradio. Expected string or array with string.",
             rawText: JSON.stringify(result.data)
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }

  } catch (error: unknown) {
    console.error("[API Route] Error during prediction:", error);

    let errorMessage = 'Unknown server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    const isServiceUnavailable = errorMessage.includes("503") || errorMessage.includes("Service Unavailable");

    const errorResponse: PredictionErrorResponse = {
        topPrediction: null,
        allPredictions: [],
        status: "error",
        error: isServiceUnavailable
            ? "The Hugging Face Space may be waking up or unavailable (503). Please try again in 1-2 minutes."
            : `Server error: ${errorMessage}`,
        rawText: `Server-side error: ${errorMessage}`
    };

    const status = isServiceUnavailable ? 503 : 500;
    return NextResponse.json(errorResponse, { status });
  }
} 