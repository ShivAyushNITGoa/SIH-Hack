// Database types and interfaces
export interface Profile {
  id: string
  email: string
  name: string
  role: 'citizen' | 'admin' | 'staff'
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  location: {
    latitude: number
    longitude: number
  }
  address: string
  media_urls: string[]
  user_id: string
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  admin_notes?: string
}

export interface ReportComment {
  id: string
  report_id: string
  user_id: string
  user_name?: string
  comment: string
  created_at: string
}

export interface Department {
  id: string
  name: string
  contact_email: string
  created_at: string
}

// Legacy interface for backward compatibility
export interface CivicIssue extends Report {
  reporter_id: string
  reporter_name: string
  reporter_email: string
  images: string[]
}