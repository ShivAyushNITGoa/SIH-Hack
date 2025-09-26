import { supabase, CivicIssue } from '@/lib/supabase'

export const getCivicIssues = async (): Promise<CivicIssue[]> => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getCivicIssueById = async (id: string): Promise<CivicIssue> => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createCivicIssue = async (issue: Omit<CivicIssue, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('civic_issues')
    .insert(issue)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateCivicIssueStatus = async (id: string, status: CivicIssue['status'], adminNotes?: string) => {
  const updateData: any = { status }
  
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  }
  
  if (adminNotes) {
    updateData.admin_notes = adminNotes
  }

  const { data, error } = await supabase
    .from('civic_issues')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getCivicIssuesByStatus = async (status: CivicIssue['status']): Promise<CivicIssue[]> => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getCivicIssuesByCategory = async (category: CivicIssue['category']): Promise<CivicIssue[]> => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getCivicIssuesStats = async () => {
  const { data, error } = await supabase
    .from('civic_issues')
    .select('status, category, priority')

  if (error) throw error

  const stats = {
    total: data.length,
    pending: data.filter(item => item.status === 'pending').length,
    inProgress: data.filter(item => item.status === 'in_progress').length,
    resolved: data.filter(item => item.status === 'resolved').length,
    rejected: data.filter(item => item.status === 'rejected').length,
    byCategory: data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byPriority: data.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }

  return stats
}
