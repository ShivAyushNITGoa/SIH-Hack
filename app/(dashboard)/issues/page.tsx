'use client';

import { useEffect, useRef, useState } from 'react';
import IssueCard from '@/components/IssueCard';
import { Report } from '@/lib/database';
import { getReportsPage, updateReportStatus } from '@/lib/queries';
import { Search, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import IssuesMap from '@/components/IssuesMap';
import { findDuplicates } from '@/lib/duplicate-detection';
import { getAllDepartments } from '@/lib/queries';
import { computeSla } from '@/lib/sla';

export default function IssuesPage() {
  const [issues, setIssues] = useState<Report[]>([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filteredIssues, setFilteredIssues] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<any[]>([]);
  const initializedRef = useRef(false);

  const slaSortKey = (r: Report) => {
    const s = computeSla(r)
    if (!s) return Number.MAX_SAFE_INTEGER
    return s.breached ? -1 : s.remainingMs
  }

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    // initial page load
    setIssues([]);
    setPageOffset(0);
    setHasMore(true);
    loadNextPage(0);
    // load departments for assignment modal
    getAllDepartments().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    filterIssues();
  }, [issues, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const loadNextPage = async (offset = pageOffset) => {
    try {
      setLoading(true);
      const PAGE_SIZE = 24;
      const data = await getReportsPage(PAGE_SIZE, offset);
      setIssues((prev) => {
        const byId = new Map<string, Report>();
        for (const it of prev) byId.set(it.id, it);
        for (const it of data) byId.set(it.id, it);
        return Array.from(byId.values());
      });
      setHasMore(data.length === PAGE_SIZE);
      setPageOffset(offset + data.length);
    } catch (error) {
      console.error('Error loading issues:', error);
      toast.error('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        issue.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (issue as any).reporter_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        issue.address.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    // Sort by SLA risk then recency
    filtered.sort((a, b) => {
      const sa = slaSortKey(a)
      const sb = slaSortKey(b)
      if (sa !== sb) return sa - sb
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    setFilteredIssues(filtered);
  };

  const handleStatusChange = async (id: string, status: Report['status']) => {
    console.log('Status change clicked:', { id, status });
    try {
      await updateReportStatus(id, status);
      setIssues(prev => prev.map(issue => 
        issue.id === id ? { ...issue, status } : issue
      ));
      toast.success(`Issue status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update issue status: ' + (error as Error).message);
    }
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/issues/${id}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading issues..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Issues</h1>
          <div className="flex items-center space-x-3">
            <button className="btn btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <Link href="/issues/new" className="btn btn-primary">
              Add Issue
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select"
                aria-label="Filter by status"
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select"
                aria-label="Filter by category"
                title="Filter by category"
              >
                <option value="all">All Categories</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="environment">Environment</option>
                <option value="safety">Safety</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="select"
                aria-label="Filter by priority"
                title="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues Map */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <IssuesMap 
              height="400px"
              filterStatus={statusFilter === 'all' ? 'all' : statusFilter}
              onIssueClick={(issue) => {
                handleViewDetails(issue.id);
              }}
            />
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => {
            const dups = findDuplicates(issue, issues).map(d => issues.find(x => x.id === d.id)!).filter(Boolean)
            return (
            <IssueCard
              key={issue.id}
              issue={issue}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              departments={departments}
              duplicates={dups}
            />
          )})}
        </div>

        {filteredIssues.length === 0 && (
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="No issues found"
            description="Try adjusting your filters or search terms."
            action={
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}