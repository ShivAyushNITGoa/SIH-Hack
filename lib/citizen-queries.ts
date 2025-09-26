import { supabase } from '@/lib/supabase'

// Simple category mapping for now - in production, this should come from the database
const categoryMapping: { [key: string]: string } = {
  'infrastructure': 'infrastructure',
  'environment': 'environment', 
  'safety': 'safety',
  'transport': 'transport',
  'utilities': 'utilities',
  'other': 'other'
}

export interface CitizenReport {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  address: string
  location?: {
    type: string
    coordinates: [number, number]
  }
  latitude?: number
  longitude?: number
  media_urls: string[]
  user_id: string
  reporter_name?: string
  comments_count?: number
  upvotes_count?: number
  has_upvoted?: boolean
  created_at: string
  updated_at: string
}

export interface ReportComment {
  id: string
  report_id: string
  user_id: string
  user_name?: string | null
  comment: string
  created_at: string
}

export async function getCitizenReports(currentUserId?: string): Promise<CitizenReport[]> {
  try {
    console.log('🔍 Starting getCitizenReports...')
    console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('🔑 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:user_id ( name ),
        report_comments(count),
        report_votes:report_votes(count)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    console.log('📊 Query result:', { data: data?.length || 0, error })

    if (error) {
      console.error('❌ Error fetching citizen reports:', error)
      throw error
    }

    // Handle case where there's no data
    if (!data || data.length === 0) {
      console.log('ℹ️ No reports found in database')
      return []
    }

    const transformedData = data.map((report: any) => ({
      ...report,
      reporter_name: report.profiles?.name || 'Anonymous',
      latitude: report.location?.coordinates?.[1],
      longitude: report.location?.coordinates?.[0],
      comments_count: Array.isArray(report.report_comments) ? report.report_comments[0]?.count ?? 0 : 0,
      upvotes_count: Array.isArray(report.report_votes) ? report.report_votes[0]?.count ?? 0 : 0,
      has_upvoted: false
    }))

    console.log('✅ Successfully transformed data:', transformedData.length, 'reports')
    return transformedData
  } catch (error) {
    console.error('❌ Error in getCitizenReports:', error)
    throw error
  }
}

export async function getCitizenReportById(id: string, currentUserId?: string): Promise<CitizenReport | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:user_id ( name ),
        report_comments(count),
        report_votes:report_votes(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching citizen report:', error)
      return null
    }

    try {
      return {
        ...data,
        reporter_name: (data as any).profiles?.name || 'Anonymous',
        latitude: (data as any).location?.coordinates?.[1] || null,
        longitude: (data as any).location?.coordinates?.[0] || null,
        comments_count: Array.isArray((data as any).report_comments) ? (data as any).report_comments[0]?.count ?? 0 : 0,
        upvotes_count: Array.isArray((data as any).report_votes) ? (data as any).report_votes[0]?.count ?? 0 : 0,
        has_upvoted: false
      }
    } catch (error) {
      console.error('Error transforming report data:', error, data)
      return {
        ...data,
        reporter_name: 'Anonymous',
        latitude: null,
        longitude: null,
        comments_count: 0,
        upvotes_count: 0,
        has_upvoted: false
      }
    }
  } catch (error) {
    console.error('Error in getCitizenReportById:', error)
    return null
  }
}

export async function getReportComments(reportId: string): Promise<ReportComment[]> {
  const { data, error } = await supabase
    .from('report_comments')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching report comments:', error)
    throw error
  }

  return (data || []) as ReportComment[]
}

export async function addReportComment(params: {
  reportId: string
  userId: string
  userName?: string
  comment: string
}): Promise<ReportComment> {
  const { data, error } = await supabase
    .from('report_comments')
    .insert([
      {
        report_id: params.reportId,
        user_id: params.userId,
        user_name: params.userName ?? null,
        comment: params.comment,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding comment:', error)
    throw error
  }

  return data as ReportComment
}

async function getExistingUpvote(reportId: string, userId: string) {
  const { data, error } = await supabase
    .from('report_votes')
    .select('*')
    .eq('report_id', reportId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error checking upvote:', error)
    throw error
  }
  return data
}

export async function getReportUpvotesCount(reportId: string): Promise<number> {
  const { data, error } = await supabase
    .from('report_votes')
    .select('report_id', { count: 'exact', head: true })
    .eq('report_id', reportId)

  if (error) {
    console.error('Error fetching upvotes count:', error)
    throw error
  }

  // @ts-ignore - count is attached on data in supabase-js head queries
  return data?.length ? data.length : (data as any)?.count ?? 0
}

export async function hasUserUpvoted(reportId: string, userId: string): Promise<boolean> {
  const existing = await getExistingUpvote(reportId, userId)
  return !!existing
}

export async function toggleReportUpvote(reportId: string, userId: string): Promise<{ upvoted: boolean }> {
  const existing = await getExistingUpvote(reportId, userId)
  if (existing) {
    const { error } = await supabase
      .from('report_votes')
      .delete()
      .eq('report_id', reportId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing upvote:', error)
      throw error
    }
    return { upvoted: false }
  }

  const { error } = await supabase
    .from('report_votes')
    .insert([{ report_id: reportId, user_id: userId }])

  if (error) {
    console.error('Error adding upvote:', error)
    throw error
  }
  return { upvoted: true }
}

// Subscriptions
export async function isSubscribed(reportId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('report_id', reportId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return false
  return !!data
}

export async function subscribeToReport(reportId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .insert({ report_id: reportId, user_id: userId })
  if (error && !String(error.message).includes('duplicate')) throw error
}

export async function unsubscribeFromReport(reportId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('report_id', reportId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function createCitizenReport(reportData: {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  address: string
  location?: {
    type: string
    coordinates: [number, number]
  }
  user_id: string
  media_urls?: string[]
}): Promise<CitizenReport> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        priority: reportData.priority,
        address: reportData.address,
        location: reportData.location,
        user_id: reportData.user_id,
        media_urls: reportData.media_urls || [],
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating citizen report:', error)
      throw error
    }

    return {
      ...data,
      reporter_name: 'Anonymous',
      latitude: data.location?.coordinates?.[1],
      longitude: data.location?.coordinates?.[0],
      comments_count: 0
    }
  } catch (error) {
    console.error('Error in createCitizenReport:', error)
    throw error
  }
}

export async function getUserReports(userId: string): Promise<CitizenReport[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:user_id (
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user reports:', error)
      throw error
    }

    const transformedData = data?.map((report: any) => ({
      ...report,
      reporter_name: report.profiles?.name || 'Anonymous',
      latitude: report.location?.coordinates?.[1],
      longitude: report.location?.coordinates?.[0],
      comments_count: 0
    })) || []

    return transformedData
  } catch (error) {
    console.error('Error in getUserReports:', error)
    throw error
  }
}
