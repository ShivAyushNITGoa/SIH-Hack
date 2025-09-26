import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { 
  Shield, 
  BarChart3, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react'

export default function AdminAppPage() {
  const features = [
    {
      title: "Issue Management",
      description: "Comprehensive dashboard to view, assign, and track all civic issues",
      icon: MapPin,
      details: [
        "View all reported issues",
        "Assign issues to departments",
        "Update issue status",
        "Add internal notes"
      ]
    },
    {
      title: "Analytics & Reports",
      description: "Detailed analytics and reporting for data-driven decision making",
      icon: BarChart3,
      details: [
        "Issue statistics and trends",
        "Department performance metrics",
        "Resolution time analysis",
        "Export reports to PDF/Excel"
      ]
    },
    {
      title: "User Management",
      description: "Manage citizens, staff, and department heads with role-based access",
      icon: Users,
      details: [
        "User registration and approval",
        "Role assignment and permissions",
        "Department management",
        "User activity monitoring"
      ]
    },
    {
      title: "Department Management",
      description: "Organize and manage different departments and their responsibilities",
      icon: Settings,
      details: [
        "Create and manage departments",
        "Assign department heads",
        "Set department categories",
        "Track department performance"
      ]
    }
  ]

  const dashboardStats = [
    { label: "Total Issues", value: "1,247", change: "+12%", color: "blue" },
    { label: "Resolved", value: "892", change: "+8%", color: "green" },
    { label: "In Progress", value: "234", change: "+15%", color: "orange" },
    { label: "Pending", value: "121", change: "-5%", color: "red" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Shield className="h-4 w-4 mr-2" />
              Administrative Dashboard
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              NagarSetu <span className="gradient-text">Admin Dashboard</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              NagarSetu's comprehensive administrative interface for managing civic issues, users, departments, and analytics. 
              Built for efficiency and transparency in civic governance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Shield className="h-5 w-5 mr-2" />
                Access Admin Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              
              <Link
                href="/website/how-it-works"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <Eye className="h-5 w-5 mr-2" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Dashboard Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive view of your civic management system at a glance.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <BarChart3 className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium text-${stat.color}-600`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Mockup */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    type="button"
                    title="Filter issues"
                    aria-label="Filter issues"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    type="button"
                    title="Search issues"
                    aria-label="Search issues"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Broken Street Light", status: "pending", priority: "high", department: "Public Works" },
                  { title: "Pothole on Main Road", status: "in_progress", priority: "urgent", department: "Transport" },
                  { title: "Garbage Collection Issue", status: "resolved", priority: "medium", department: "Sanitation" }
                ].map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                      <p className="text-sm text-gray-600">{issue.department}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.status}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          className="p-1 text-gray-500 hover:text-blue-600"
                          type="button"
                          title="View issue"
                          aria-label="View issue"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-green-600"
                          type="button"
                          title="Edit issue"
                          aria-label="Edit issue"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage civic issues efficiently and transparently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Key Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features designed for efficient civic management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">Get instant notifications and updates on issue status changes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export & Reports</h3>
              <p className="text-gray-600 text-sm">Generate detailed reports and export data for analysis</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">Comprehensive user management with role-based permissions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Security & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with security and compliance in mind for government and municipal use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
              <p className="text-sm text-gray-600">All data encrypted in transit and at rest</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Role-based Access</h3>
              <p className="text-sm text-gray-600">Granular permissions and access control</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Audit Trails</h3>
              <p className="text-sm text-gray-600">Complete audit logs for all actions</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Compliance Ready</h3>
              <p className="text-sm text-gray-600">Built to meet government standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Manage Your City?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access the admin dashboard and start managing civic issues efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Shield className="h-5 w-5 mr-2" />
              Access Admin Dashboard
            </Link>
            
            <Link
              href="/website/how-it-works"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Eye className="h-5 w-5 mr-2" />
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
