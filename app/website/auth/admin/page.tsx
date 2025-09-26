'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { signIn, signUp, signOut, getUserRoleFromEmail } from '@/lib/auth'

export default function AdminAuthPage() {
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Show immediate feedback
        toast.loading('Signing in...', { id: 'signin' })
        
        // Handle login
        console.log('Attempting to sign in with:', formData.email)
        const { user, error } = await signIn(formData.email, formData.password)
        
        if (error) {
          console.error('Sign in error:', error)
          throw error
        }
        
        if (user) {
          console.log('Sign in successful, user:', user)
          // Check if user has admin email domain
          const isAdminEmail = formData.email.endsWith('@nitgoa.ac.in') || formData.email.endsWith('@gmail.com')
          
          if (isAdminEmail) {
            toast.success('NagarSetu admin login successful!', { id: 'signin' })
            // Small delay to ensure auth state is set before redirect
            setTimeout(() => {
              // Redirect to dashboard in main app
              window.location.href = '/dashboard'
            }, 1000)
          } else {
            toast.success('Login successful! Redirecting to citizen app.', { id: 'signin' })
            setTimeout(() => {
              // Redirect to citizen app in main app
              window.location.href = '/citizen'
            }, 1000)
          }
        }
      } else {
        // Handle signup - only allow admin emails
        if (!formData.email.endsWith('@nitgoa.ac.in') && !formData.email.endsWith('@gmail.com')) {
          toast.error('Only @nitgoa.ac.in and @gmail.com emails are allowed for NagarSetu admin accounts')
          setLoading(false)
          return
        }
        
        toast.loading('Creating account...', { id: 'signup' })
        
        console.log('Attempting to sign up with:', formData.email)
        const { user, error } = await signUp(formData.email, formData.password, formData.name, { phone: formData.phone })
        
        if (error) {
          console.error('Sign up error:', error)
          throw error
        }
        
        if (user) {
          console.log('Sign up successful, user:', user)
          toast.success('NagarSetu admin account created successfully! Please check your email to confirm your account.', { id: 'signup' })
          setIsLogin(true) // Switch to login mode
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      toast.error(error.message || 'Authentication failed. Please try again.', { id: isLogin ? 'signin' : 'signup' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/website"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Website
          </Link>
          
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            NagarSetu {isLogin ? 'Admin Login' : 'Admin Sign Up'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to your NagarSetu admin account to manage civic issues' 
              : 'Create a NagarSetu admin account to access the management dashboard'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="admin@nitgoa.ac.in"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in to NagarSetu...' : 'Creating NagarSetu account...'}
                </div>
              ) : (
                isLogin ? 'Sign In to NagarSetu' : 'Create NagarSetu Account'
              )}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have a NagarSetu admin account?" : "Already have a NagarSetu admin account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">NagarSetu Admin Access Required</p>
              <p>
                NagarSetu admin accounts are for authorized personnel only. If you need admin access, 
                please contact your system administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Looking for something else?</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/website/auth/citizen"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Citizen Portal
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/website"
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
