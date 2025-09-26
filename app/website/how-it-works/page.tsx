import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { 
  UserPlus, 
  MapPin, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  MessageSquare,
  BarChart3,
  Smartphone,
  Globe,
  Users
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Citizen Reports Issue",
      description: "Citizens report civic issues through web portal or mobile app with photos, location, and details.",
      icon: UserPlus,
      color: "blue"
    },
    {
      number: 2,
      title: "System Categorizes",
      description: "AI-powered system automatically categorizes and prioritizes issues based on type and severity.",
      icon: MapPin,
      color: "green"
    },
    {
      number: 3,
      title: "Admin Reviews",
      description: "Administrators review and assign issues to appropriate departments or staff members.",
      icon: Shield,
      color: "purple"
    },
    {
      number: 4,
      title: "Department Takes Action",
      description: "Assigned departments work on resolving the issue and provide regular updates.",
      icon: CheckCircle,
      color: "orange"
    },
    {
      number: 5,
      title: "Citizen Gets Updates",
      description: "Citizens receive real-time notifications about progress and resolution status.",
      icon: MessageSquare,
      color: "indigo"
    }
  ]

  const features = [
    {
      title: "Multi-Platform Access",
      description: "Access through web browsers, mobile apps, and admin dashboards",
      icon: Globe,
      platforms: ["Web Portal", "Mobile App", "Admin Dashboard"]
    },
    {
      title: "Real-time Communication",
      description: "Instant notifications and updates for all stakeholders",
      icon: MessageSquare,
      platforms: ["Push Notifications", "Email Alerts", "In-app Messages"]
    },
    {
      title: "Comprehensive Analytics",
      description: "Detailed reports and insights for better decision making",
      icon: BarChart3,
      platforms: ["Issue Statistics", "Performance Metrics", "Trend Analysis"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How <span className="gradient-text">NagarSetu</span> Works
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A streamlined process that connects citizens with local administration to resolve civic issues efficiently and transparently.
            </p>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Complete Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From issue reporting to resolution, here's how NagarSetu streamlines civic management.
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col lg:flex-row items-center gap-8">
                <div className={`flex-shrink-0 w-20 h-20 bg-${step.color}-100 rounded-2xl flex items-center justify-center`}>
                  <step.icon className={`h-10 w-10 text-${step.color}-600`} />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Key Features & Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make civic issue management efficient and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.platforms.map((platform, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {platform}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Who Uses NagarSetu?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Different user roles with specific permissions and responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Citizens</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Report civic issues
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Track issue progress
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Vote on issues
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Add comments
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrators</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Manage all issues
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Assign to departments
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  View analytics
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Manage users
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Department Staff</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  View assigned issues
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Update progress
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Add status updates
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Mark as resolved
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leveraging cutting-edge technologies for optimal performance and user experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Next.js</h3>
              <p className="text-sm text-gray-600">Web Applications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flutter</h3>
              <p className="text-sm text-gray-600">Mobile App</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Supabase</h3>
              <p className="text-sm text-gray-600">Backend & Database</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Experience NagarSetu?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the platform and start making a difference in your community today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/citizen"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Users className="h-5 w-5 mr-2" />
              Start as Citizen
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Shield className="h-5 w-5 mr-2" />
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
