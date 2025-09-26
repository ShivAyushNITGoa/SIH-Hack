'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Smartphone, Globe, Shield, Download } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/website' },
    { name: 'How It Works', href: '/website/how-it-works' },
    { name: 'Admin App', href: '/website/admin-app' },
    { name: 'Citizen App', href: '/website/citizen-app' },
    { name: 'Mobile App', href: '/website/mobile-app' },
    { name: 'Downloads', href: '/website/downloads' },
    { name: 'About', href: '/website/about' },
  ]

  const appLinks = [
    { name: 'Admin Dashboard', href: '/website/auth/admin', icon: Shield, description: 'Manage civic issues' },
    { name: 'Citizen Portal', href: '/website/auth/citizen', icon: Globe, description: 'Report & track issues' },
    { name: 'Mobile App', href: '/website/mobile-app', icon: Smartphone, description: 'Download mobile app' },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/website" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NS</span>
            </div>
            <span className="text-xl font-bold gradient-text">NagarSetu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* App Access Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/website/auth/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Admin Login
            </Link>
            <Link
              href="/website/auth/citizen"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Citizen Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden py-4 border-t border-gray-200 transition-all duration-300 ${
          isMenuOpen ? 'block' : 'hidden'
        }`}>
          <div className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-base font-medium transition-colors hover:text-blue-600 ${
                  pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Access</h3>
              {appLinks.map((app) => (
                <Link
                  key={app.name}
                  href={app.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <app.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
