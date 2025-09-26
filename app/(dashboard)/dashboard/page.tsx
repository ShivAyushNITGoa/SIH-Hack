'use client'

import { useEffect, useState } from 'react'
import { getReportsPage, getReportsStats, updateReportStatus, Report } from '@/lib/queries'
import { getDepartmentsForAssignment } from '@/lib/department-workflow'
import { Department } from '@/lib/database'
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle, Search, Eye, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import IssuesMap from '@/components/IssuesMap'
import IssueCard from '@/components/IssueCard'

export default function Dashboard() {
  const [issues, setIssues] = useState<Report[]>([])
  const [stats, setStats] = useState<any>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<Report | null>(null)
  const [showQuickActions, setShowQuickActions] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [issuesData, statsData, departmentsData] = await Promise.all([
        getReportsPage(12, 0),
        getReportsStats(),
        getDepartmentsForAssignment()
      ])
      setIssues(issuesData)
      setStats(statsData)
      setDepartments(departmentsData)
      console.log('Loaded issues:', issuesData.length)
      console.log('Loaded stats:', statsData)
      console.log('Loaded departments:', departmentsData.length)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }


  const handleQuickAction = async (issueId: string, action: 'in_progress' | 'resolved' | 'closed') => {
    console.log('Quick action clicked:', { issueId, action })
    try {
      await updateReportStatus(issueId, action)
      toast.success(`Issue marked as ${action.replace('_', ' ')}`)
      loadData()
    } catch (error) {
      console.error('Error in handleQuickAction:', error)
      toast.error('Failed to update issue status: ' + (error as Error).message)
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter
    const matchesSearch = searchTerm === '' || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
          {/* Admin Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">From citizens</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Awaiting Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-500">Need attention</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-500">Being addressed</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues by title, description, reporter, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Status Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats?.total || 0})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats?.pending || 0})
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'in_progress'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress ({stats?.inProgress || 0})
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'resolved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Resolved ({stats?.resolved || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Issues Management Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {filter === 'all' ? 'All Citizen Reports' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Reports`}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track civic issues reported by citizens
            </p>
          </div>
          <div className="overflow-x-auto">
            {filteredIssues.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'No civic issues have been reported by citizens yet.' 
                    : `No ${filter} reports found.`
                  }
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onStatusChange={handleQuickAction}
                      onViewDetails={(id) => window.location.href = `/issues/${id}`}
                      departments={departments}
                      onDepartmentAssigned={loadData}
                    />
                  ))}
                              </div>
                              </div>
                            )}
                          </div>
                            </div>

        {/* Issues Map */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <IssuesMap 
              height="400px"
              onIssueClick={(issue) => {
                // Navigate to issue details
                window.location.href = `/issues/${issue.id}`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
