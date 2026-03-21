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
    <div className="pb-page-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent py-20 sm:py-28 border-b border-[#f3b7d1]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#fff0f7] rounded-full mb-6 border border-[#f3b7d1]">
              <Zap className="w-4 h-4 text-[#d72688] mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#d72688]">
                Garlet Upgrade - PhotoBooth
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-[#4a2337]">Capture Moments</span>
              <br />
              <span className="text-[#d72688]">
                With Garlet Upgrade
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed px-2">
              Your favorite digital photobooth experience - capture fun moments with friends using our modern, practical, and easy-to-use platform
            </p>

            {/* CTA Button */}
            <Link
              href="/photo"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d72688] to-[#fa75aa] text-white text-base sm:text-lg font-semibold rounded-full hover:brightness-95 active:scale-95 transition duration-300 shadow-xl hover:shadow-2xl"
            >
              <Camera className="w-5 h-5 mr-2 flex-shrink-0" />
              Try It Now
            </Link>

            {/* Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d72688] mb-2">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 font-medium text-sm sm:text-base">
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
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
      <section className="py-20 sm:py-28 bg-[#fffafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose 
              <span className="text-[#d72688]"> Garlet Upgrade?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create amazing photo memories in one place
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="group p-5 sm:p-6 bg-white border border-[#f3b7d1] rounded-2xl hover:shadow-xl hover:border-[#fa75aa] hover:scale-105 transition duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#fff0f7] to-[#ffe1ee] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition flex-shrink-0">
                    <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-[#d72688]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#d72688] via-[#fa75aa] to-[#d72688]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-white mx-auto mb-4 sm:mb-6 animate-pulse flex-shrink-0" />
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Create Amazing Photos?
          </h2>
          <p className="text-base sm:text-lg text-pink-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating beautiful photo memories with Garlet Upgrade
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/photo"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#d72688] text-base sm:text-lg font-semibold rounded-full hover:brightness-95 active:scale-95 transition shadow-xl"
            >
              <Camera className="w-5 h-5 mr-2 flex-shrink-0" />
              Start Now - It&apos;s Free
            </Link>
            
            {!session && (
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white/10 active:scale-95 transition"
              >
                <Zap className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Create Account</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5e2740] text-pink-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#fa75aa] to-[#d72688] rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Garlet Upgrade</h3>
                  <p className="text-xs text-pink-200">PhotoBooth</p>
                </div>
              </div>
              <p className="text-sm text-pink-200 ml-13">Create memories that last forever</p>
            </div>
            
            <div className="flex gap-4 sm:gap-6 text-sm">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/photo" className="hover:text-white transition">Booth</Link>
              <Link href="/photo/gallery" className="hover:text-white transition">Gallery</Link>
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-white transition">Admin</Link>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#8b4b66] text-center text-xs sm:text-sm text-pink-200">
            <p>&copy; 2025 Garlet Upgrade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

