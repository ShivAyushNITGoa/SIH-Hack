import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
import Link from 'next/link'
import { 
  Shield, 
  Globe, 
  Smartphone, 
  Users, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  Play
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              Smart Civic Issues Management Platform
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="gradient-text">NagarSetu</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridging the gap between citizens and local administration through technology. 
              Report, track, and resolve civic issues efficiently with our comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/website/auth/citizen"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Globe className="h-5 w-5 mr-2" />
                Citizen Portal
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>

              <Link
                href="/website/auth/admin"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>

              <Link
                href="/website/how-it-works"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <Play className="h-5 w-5 mr-2" />
                How It Works
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-float-delay-1"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-float-delay-2"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Complete Solution for Civic Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three powerful applications working together to create a seamless civic issues management ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Dashboard */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">NagarSetu Admin Dashboard</h3>
              <p className="text-gray-600 mb-6">
                NagarSetu's comprehensive management interface for administrators to oversee, assign, and track civic issues efficiently.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Issue Management & Assignment
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Analytics & Reporting
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Department Management
                </li>
              </ul>
              <Link
                href="/website/admin-app"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Citizen Web App */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">NagarSetu Citizen Portal</h3>
              <p className="text-gray-600 mb-6">
                NagarSetu's user-friendly web interface for citizens to report issues, track progress, and engage with their community.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Easy Issue Reporting
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time Tracking
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Community Engagement
                </li>
              </ul>
              <Link
                href="/website/citizen-app"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Mobile App */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile App</h3>
              <p className="text-gray-600 mb-6">
                Native mobile application for iOS and Android, providing on-the-go access to civic issue management.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cross-platform Support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Offline Capabilities
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Push Notifications
                </li>
              </ul>
              <Link
                href="/website/mobile-app"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline civic issue management and improve citizen engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location-based</h3>
              <p className="text-gray-600 text-sm">GPS-enabled issue reporting with precise location tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">Instant notifications and status updates for all stakeholders</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Comprehensive analytics and reporting for data-driven decisions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-user</h3>
              <p className="text-gray-600 text-sm">Role-based access for citizens, staff, and administrators</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens and administrators already using NagarSetu to improve their communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/website/auth/citizen"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Globe className="h-5 w-5 mr-2" />
              Start as Citizen
            </Link>
            
            <Link
              href="/website/auth/admin"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Shield className="h-5 w-5 mr-2" />
              Admin Access
            </Link>
            
            <Link
              href="/website/downloads"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <Download className="h-5 w-5 mr-2" />
              Download App
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
