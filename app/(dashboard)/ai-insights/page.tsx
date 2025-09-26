'use client';

import { useEffect, useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Download,
  Filter,
  Search,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { analyzeIssue, analyzeIssues, getCategoryStats, getPriorityStats, IssueAnalysis } from '@/lib/ai-categorization';
import { getAllReports } from '@/lib/queries';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AIInsightsPage() {
  const [analyses, setAnalyses] = useState([] as IssueAnalysis[]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null as any);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      setLoading(true);
      const issues = await getAllReports();
      
      // Analyze all issues with AI
      const issueData = issues.map(issue => ({
        title: issue.title,
        description: issue.description
      }));
      
      const aiAnalyses = analyzeIssues(issueData);
      setAnalyses(aiAnalyses);
      
    } catch (error) {
      console.error('Error loading AI insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const analyzeNewIssue = (title: string, description: string) => {
    return analyzeIssue(title, description);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAnalyses = analyses.filter((analysis: IssueAnalysis) => {
    const matchesSearch = analysis.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    ) || analysis.suggestedCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || analysis.suggestedCategory === filterCategory;
    const matchesPriority = filterPriority === 'all' || analysis.suggestedPriority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categoryStats = getCategoryStats(analyses);
  const priorityStats = getPriorityStats(analyses);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Analyzing issues with AI..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-600 mt-2">AI-powered analysis and intelligent recommendations for civic issues</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadAIInsights}
              className="btn btn-ghost flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(analyses, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ai-insights.json';
                a.click();
                URL.revokeObjectURL(url);
                toast.success('AI insights exported');
              }}
              className="btn btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* AI Analysis Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyses.filter((a: IssueAnalysis) => a.confidence >= 0.8).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Urgent Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyses.filter((a: IssueAnalysis) => a.suggestedPriority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analyses.reduce((sum: number, a: IssueAnalysis) => sum + a.confidence, 0) / analyses.length * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category and Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {categoryStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{stat.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{stat.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(stat.count / analyses.length) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              {priorityStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      stat.priority === 'urgent' ? 'bg-red-500' :
                      stat.priority === 'high' ? 'bg-orange-500' :
                      stat.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{stat.priority}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{stat.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stat.priority === 'urgent' ? 'bg-red-500' :
                          stat.priority === 'high' ? 'bg-orange-500' :
                          stat.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(stat.count / analyses.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keywords or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categoryStats.map(stat => (
                  <option key={stat.category} value={stat.category}>
                    {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="select"
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Analysis Results */}
        <div className="space-y-4">
          {filteredAnalyses.map((analysis: IssueAnalysis, index: number) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      Analysis #{index + 1}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                      {Math.round(analysis.confidence * 100)}% confidence
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(analysis.suggestedPriority)}`}>
                      {analysis.suggestedPriority} priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Suggested Category</h4>
                      <p className="text-lg font-semibold text-blue-600 capitalize">
                        {analysis.suggestedCategory}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Detected Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywords.slice(0, 5).map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                        {analysis.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                            +{analysis.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">AI Reasoning</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {analysis.reasoning}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      // In a real app, this would apply the AI suggestions
                      toast.success('AI suggestions applied');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Apply Suggestions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnalyses.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI insights found</h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No issues have been analyzed yet.'
              }
            </p>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Automation Opportunities</h3>
              </div>
              <p className="text-sm text-gray-600">
                {analyses.filter((a: IssueAnalysis) => a.confidence >= 0.8).length} issues can be automatically categorized and assigned.
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-3">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Urgent Attention</h3>
              </div>
              <p className="text-sm text-gray-600">
                {analyses.filter((a: IssueAnalysis) => a.suggestedPriority === 'urgent').length} issues require immediate attention.
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Efficiency Gains</h3>
              </div>
              <p className="text-sm text-gray-600">
                AI categorization could reduce manual processing time by up to 60%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
