import Link from "next/link"
import { Leaf } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-green-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-700" />
            <span className="font-bold text-xl text-green-900">RiceHealth</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-green-800 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link href="#about" className="text-green-800 hover:text-green-600 font-medium">
              About
            </Link>
            <Link href="#diseases" className="text-green-800 hover:text-green-600 font-medium">
              Diseases
            </Link>
            <Link href="#contact" className="text-green-800 hover:text-green-600 font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

