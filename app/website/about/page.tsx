import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { 
  Users, 
  Code, 
  Globe, 
  Heart, 
  Award, 
  Target, 
  Lightbulb,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  ExternalLink
} from 'lucide-react'

export default function AboutPage() {
  const teamValues = [
    {
      title: "Innovation",
      description: "We believe in pushing the boundaries of technology to create solutions that make a real difference.",
      icon: Lightbulb,
      color: "blue"
    },
    {
      title: "Quality",
      description: "Every line of code is written with precision and every feature is designed with care.",
      icon: Award,
      color: "green"
    },
    {
      title: "Impact",
      description: "We focus on creating technology that has a positive impact on communities and society.",
      icon: Target,
      color: "purple"
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients and users to ensure our solutions meet real needs.",
      icon: Users,
      color: "orange"
    }
  ]

  const technologies = [
    { name: "Next.js", category: "Frontend", description: "React framework for web applications" },
    { name: "Flutter", category: "Mobile", description: "Cross-platform mobile development" },
    { name: "TypeScript", category: "Language", description: "Type-safe JavaScript development" },
    { name: "Supabase", category: "Backend", description: "Open source Firebase alternative" },
    { name: "Tailwind CSS", category: "Styling", description: "Utility-first CSS framework" },
    { name: "PostgreSQL", category: "Database", description: "Advanced open source database" }
  ]

  const milestones = [
    {
      year: "2024",
      title: "NagarSetu Launch",
      description: "Launched comprehensive civic issues management platform"
    },
    {
      year: "2024",
      title: "Multi-Platform Development",
      description: "Developed web, mobile, and admin applications"
    },
    {
      year: "2024",
      title: "Community Focus",
      description: "Built solutions for better civic engagement"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Users className="h-4 w-4 mr-2" />
              About The GDevelopers
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="gradient-text">The GDevelopers</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We are a passionate team of developers dedicated to creating technology solutions that bridge the gap 
              between citizens and local administration. Our mission is to make civic engagement accessible, 
              efficient, and transparent for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:contact@thegdevelopers.online"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              
              <Link
                href="/website/how-it-works"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <Globe className="h-5 w-5 mr-2" />
                Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At The GDevelopers, we believe that technology should serve the community. Our mission is to create 
                innovative solutions that make civic engagement more accessible, transparent, and effective.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                NagarSetu represents our commitment to building bridges between citizens and local administration 
                through technology. We envision a world where every citizen can easily report issues, track progress, 
                and actively participate in improving their community.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-gray-600">Community First</span>
                </div>
                <div className="flex items-center">
                  <Code className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-600">Open Source</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">GD</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The GDevelopers</h3>
                <p className="text-gray-600 mb-6">
                  Building technology solutions for better civic engagement and community development.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Based in India
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    thegdevelopers.online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every solution we create.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${value.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className={`h-8 w-8 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We use modern, reliable technologies to build robust and scalable solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {tech.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to improve civic engagement through technology.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about NagarSetu or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">contact@thegdevelopers.online</p>
              <Link
                href="mailto:contact@thegdevelopers.online"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Send Email
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">+91 98765 43210</p>
              <Link
                href="tel:+919876543210"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Call Now
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 mb-4">India</p>
              <Link
                href="https://thegdevelopers.online"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Visit Website
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Follow Our Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Stay updated with our latest projects and community initiatives.
            </p>
            
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in building better communities through technology. Start using NagarSetu today.
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
              <Code className="h-5 w-5 mr-2" />
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
