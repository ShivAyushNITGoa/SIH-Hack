'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getCitizenReports, CitizenReport } from '@/lib/citizen-queries'
import { Search, MapPin, Clock, CheckCircle, AlertCircle, TrendingUp, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Lazy load heavy components with better loading states
const IssueCard = dynamic(() => import('@/components/citizen/IssueCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
})

const LoadingSpinner = dynamic(() => import('@/components/LoadingSpinner'), {
  ssr: false
})

const CitizenPageSkeleton = dynamic(() => import('@/components/citizen/SkeletonLoader').then(mod => ({ default: mod.CitizenPageSkeleton })), {
  ssr: false
})

const HeaderBar = dynamic(() => import('@/components/citizen/HeaderBar'))
const FiltersBar = dynamic(() => import('@/components/citizen/FiltersBar'))
const FloatingReportButton = dynamic(() => import('@/components/citizen/FloatingReportButton'))

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'resolved'
type SortBy = 'recent' | 'priority'
type ViewMode = 'list' | 'grid'

export default function CitizenIssuesPage() {
  const [issues, setIssues] = useState<CitizenReport[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('citizen-category') || '' : ''))
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>(() => (typeof window !== 'undefined' ? (localStorage.getItem('citizen-status') as FilterStatus) || 'all' : 'all'))
  const [sortBy, setSortBy] = useState<SortBy>(() => (typeof window !== 'undefined' ? (localStorage.getItem('citizen-sort') as SortBy) || 'recent' : 'recent'))
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>(() => (typeof window !== 'undefined' ? (localStorage.getItem('citizen-view') as ViewMode) || 'list' : 'list'))
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'environment', label: 'Environment' },
    { value: 'safety', label: 'Public Safety' },
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' },
  ]

  const statusTabs = [
    { value: 'all', label: 'All', icon: MapPin },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'in_progress', label: 'In Progress', icon: AlertCircle },
    { value: 'resolved', label: 'Resolved', icon: CheckCircle },
  ]

  useEffect(() => {
    loadIssues()
  }, [])

  const loadIssues = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      console.time('Citizen reports load time')
      const data = await getCitizenReports()
      console.timeEnd('Citizen reports load time')
      
      setIssues(data)
      
      // Calculate stats efficiently
      const newStats = data.reduce((acc, issue) => {
        acc.total++
        if (issue.status === 'pending') acc.pending++
        else if (issue.status === 'in_progress') acc.inProgress++
        else if (issue.status === 'resolved') acc.resolved++
        return acc
      }, { total: 0, pending: 0, inProgress: 0, resolved: 0 })
      
      setStats(newStats)
    } catch (error) {
      console.error('Error loading issues:', error)
      toast.error('Failed to load issues')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || issue.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      }
      return 0
    })
  }, [issues, searchTerm, selectedCategory, selectedStatus, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  useEffect(() => { try { localStorage.setItem('citizen-category', selectedCategory) } catch {} }, [selectedCategory])
  useEffect(() => { try { localStorage.setItem('citizen-status', selectedStatus) } catch {} }, [selectedStatus])
  useEffect(() => { try { localStorage.setItem('citizen-sort', sortBy) } catch {} }, [sortBy])
  useEffect(() => { try { localStorage.setItem('citizen-view', viewMode) } catch {} }, [viewMode])

  if (loading) {
    return <CitizenPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <HeaderBar
        title="NagarSetu"
        subtitle="Report and track community issues"
        onRefresh={() => loadIssues(true)}
        refreshing={refreshing}
      />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total Issues</p>

              </div>
            </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  <p className="text-xs text-gray-600">Resolved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Status Tabs + View Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex space-x-1 bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl">
              {statusTabs.map((tab) => {
                const isActive = selectedStatus === tab.value
                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedStatus(tab.value as FilterStatus)}
                    className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    
                  >
                    <tab.icon className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="hidden sm:flex items-center bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
                
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
                
              >
                Grid
              </button>
            </div>
          </div>

      <FiltersBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Issues List */}
      <div className="px-4 sm:px-6 lg:px-8 pb-28">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory || selectedStatus !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Be the first to report an issue in your area'
                }
              </p>
              {!searchTerm && !selectedCategory && selectedStatus === 'all' && (
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Report First Issue
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'grid gap-4 sm:gap-6'}>
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* Floating CTA on mobile */}
      <FloatingReportButton />
    </div>
  )
}
