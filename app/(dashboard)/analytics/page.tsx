'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  RefreshCw,
  Brain,
  Target,
  Zap
} from 'lucide-react';
import { generateMockAnalytics, AnalyticsData, calculateRealTimeMetrics } from '@/lib/advanced-analytics';
import { getAllReports } from '@/lib/queries';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null as AnalyticsData | null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null as any);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load real issues for real-time metrics
      const issues = await getAllReports();
      const realTime = calculateRealTimeMetrics(issues);
      setRealTimeData(realTime);
      
      // Generate mock analytics (in production, this would come from your analytics API)
      const mockData = generateMockAnalytics();
      setAnalytics(mockData);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = (format: 'json' | 'csv' | 'pdf' = 'json') => {
    if (!analytics) return;
    
    let dataStr = '';
    let mimeType = '';
    let filename = '';
    
    switch (format) {
      case 'json':
        dataStr = JSON.stringify(analytics, null, 2);
        mimeType = 'application/json';
        filename = 'analytics-data.json';
        break;
      case 'csv':
        dataStr = convertToCSV(analytics);
        mimeType = 'text/csv';
        filename = 'analytics-data.csv';
        break;
      default:
        toast.error('PDF export not implemented');
        return;
    }
    
    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Analytics data exported as ${format.toUpperCase()}`);
  };

  const convertToCSV = (data: AnalyticsData): string => {
    const lines = [];
    lines.push('Metric,Value');
    lines.push(`Total Issues,${data.overview.totalIssues}`);
    lines.push(`Resolved Issues,${data.overview.resolvedIssues}`);
    lines.push(`Pending Issues,${data.overview.pendingIssues}`);
    lines.push(`In Progress Issues,${data.overview.inProgressIssues}`);
    lines.push(`Average Resolution Time,${data.overview.averageResolutionTime}`);
    lines.push(`Citizen Satisfaction,${data.overview.citizenSatisfaction}`);
    return lines.join('\n');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Unable to load analytics data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights and predictive analytics for civic issues management</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="select"
              aria-label="Select time range"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={loadAnalytics}
              className="btn btn-ghost flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <div className="relative">
              <button className="btn btn-primary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={() => exportData('json')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportData('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData?.totalIssues || analytics.overview.totalIssues}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData?.resolvedIssues || analytics.overview.resolvedIssues}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(((realTimeData?.resolvedIssues || analytics.overview.resolvedIssues) / (realTimeData?.totalIssues || analytics.overview.totalIssues)) * 100)}% resolution rate
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Resolution</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageResolutionTime}d</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.citizenSatisfaction}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center mb-6">
              <Brain className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">AI Predictions</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Next Week Forecast</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {analytics.predictions.nextWeekPrediction.expectedIssues} issues expected
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Confidence: {Math.round(analytics.predictions.nextWeekPrediction.confidence * 100)}%
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Top Predicted Categories:</h4>
                {analytics.predictions.nextWeekPrediction.topCategories.map((cat: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{cat.category}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(cat.probability * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Resource Recommendations</h2>
            </div>
            <div className="space-y-4">
              {analytics.predictions.resourceRecommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{rec.department}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Recommended: {rec.recommendedStaff} staff members
                  </p>
                  <p className="text-xs text-gray-500">{rec.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issues Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues Trend (12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="issues" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(analytics.trends[0]?.categoryBreakdown || {}).map(([category, count]) => ({
                    name: category,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(analytics.trends[0]?.categoryBreakdown || {}).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Hotspots</h3>
            <div className="space-y-4">
              {analytics.geographic.hotspots.map((hotspot, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{hotspot.location}</h4>
                      <p className="text-sm text-gray-500">{hotspot.issueCount} issues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hotspot.severity === 'high' ? 'bg-red-100 text-red-800' :
                      hotspot.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {hotspot.severity} severity
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {hotspot.topCategories.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analytics.temporal.hourlyDistribution).map(([hour, count]) => ({
                hour: `${hour}:00`,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
          <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analytics.performance.departmentWorkload).map(([dept, workload]) => (
              <div key={dept} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">{dept}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Load</span>
                    <span className="font-medium">{workload.current}/{workload.capacity}</span>
          </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        workload.utilization > 0.8 ? 'bg-red-500' :
                        workload.utilization > 0.6 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${workload.utilization * 100}%` }}
                    ></div>
              </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Utilization</span>
                    <span>{Math.round(workload.utilization * 100)}%</span>
              </div>
            </div>
          </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}