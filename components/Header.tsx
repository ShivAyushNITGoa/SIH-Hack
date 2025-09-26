'use client'

import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports, users, or locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <Link href="/profile" className="flex items-center space-x-3 hover:opacity-90">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}