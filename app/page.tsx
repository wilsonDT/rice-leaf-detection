import Header from "../components/header"
import ImageUploader from "../components/image-uploader"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Rice Leaf Disease Classifier</h1>
            <p className="text-gray-600 md:text-lg">
              Upload an image of a rice leaf to identify potential diseases. Our AI-powered tool helps farmers diagnose
              problems quickly and accurately.
            </p>
          </div>

          <ImageUploader />

          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-800 text-xl font-bold">1</span>
                </div>
                <h3 className="font-medium text-green-800 mb-2">Upload Image</h3>
                <p className="text-gray-600 text-sm">Take a clear photo of the rice leaf and upload it</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-800 text-xl font-bold">2</span>
                </div>
                <h3 className="font-medium text-green-800 mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-sm">Our AI model analyzes the leaf characteristics</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-800 text-xl font-bold">3</span>
                </div>
                <h3 className="font-medium text-green-800 mb-2">Get Results</h3>
                <p className="text-gray-600 text-sm">Receive accurate disease identification and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-green-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Rice Leaf Disease Classifier. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

