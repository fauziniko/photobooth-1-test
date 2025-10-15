'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Camera, 
  Sparkles, 
  Zap, 
  Star, 
  Users,
  Heart,
  Gift,
  Shield,
  Smartphone,
  Image as ImageIcon,
  Download
} from 'lucide-react'

export default function HomePage() {
  const { data: session } = useSession()

  const stats = [
    { label: 'Total Users', value: '2K+', icon: Users },
    { label: 'Templates Used', value: '100K++', icon: ImageIcon },
    { label: 'User Rating', value: '5 ★', icon: Star },
  ]

  const features = [
    {
      icon: Camera,
      title: 'Easy to Use',
      description: 'Simple interface that anyone can use without any technical knowledge'
    },
    {
      icon: Sparkles,
      title: 'Beautiful Templates',
      description: 'Choose from hundreds of professionally designed frame templates'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on any device - desktop, tablet, or mobile phone'
    },
    {
      icon: Download,
      title: 'Instant Download',
      description: 'Get your photo strips instantly in high quality format'
    },
    {
      icon: Gift,
      title: 'Free to Use',
      description: 'No credit card required. Start creating amazing photos right now'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your photos are yours. We respect your privacy and data'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">
                Digital Photobooth Made Simple
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Capture Fun
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                With PhotoBooth!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Capture fun moments with friends using our cool, practical, and
              modern digital photobooth
            </p>

            {/* CTA Button */}
            <Link
              href="/photo"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-600 transition transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Try It Now
            </Link>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 font-medium">
                      <Icon className="w-4 h-4 mr-2" />
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PhotoBooth Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"> PhotoBooth?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create amazing photo memories in one place
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="group p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-purple-200 transition duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Create Amazing Photos?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating beautiful photo memories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/photo"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Now - It&apos;s Free
            </Link>
            
            {!session && (
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-purple-600 transition transform hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Sign Up for More
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PhotoBooth</span>
              </div>
              <p className="text-sm text-gray-400">Create memories that last forever</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/photo" className="hover:text-white transition">Booth</Link>
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-white transition">Admin</Link>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2025 PhotoBooth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

