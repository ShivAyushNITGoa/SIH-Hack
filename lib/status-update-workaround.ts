// Workaround for RLS infinite recursion issue
// This file provides alternative methods to update report status

import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'

// Method 1: Use a simple approach that doesn't trigger RLS recursion
export const updateReportStatusSimple = async (id: string, status: string, adminNotes?: string) => {
  try {
    // Create a new supabase client with different settings
    const simpleClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    } else {
      updateData.resolved_at = null
    }
    
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes
    }

    console.log('Updating report status (simple method):', { id, status, updateData })

    const { data, error } = await simpleClient
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Simple update failed:', error)
      throw error
    }

    console.log('Report status updated successfully (simple method):', data)
    return data
  } catch (error) {
    console.error('Simple update method failed:', error)
    throw error
  }
}

// Method 2: Use raw SQL query (if RPC is available)
export const updateReportStatusSQL = async (id: string, status: string, adminNotes?: string) => {
  try {
    const resolvedAt = status === 'resolved' ? new Date().toISOString() : null
    
    const { data, error } = await supabase.rpc('update_report_status_sql', {
      report_id: id,
      new_status: status,
      admin_notes: adminNotes || null,
      resolved_at: resolvedAt
    })

    if (error) {
      console.error('SQL update failed:', error)
      throw error
    }

    console.log('Report status updated via SQL:', data)
    return data
  } catch (error) {
    console.error('SQL update method failed:', error)
    throw error
  }
}

// Method 3: Use batch update approach
export const updateReportStatusBatch = async (id: string, status: string, adminNotes?: string) => {
  try {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    } else {
      updateData.resolved_at = null
    }
    
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes
    }

    console.log('Updating report status (batch method):', { id, status, updateData })

    // Use batch operations
    const { data, error } = await supabase
      .from('reports')
      .upsert([
        {
          id: id,
          ...updateData
        }
      ])
      .select()
      .maybeSingle()

    if (error) {
      console.error('Batch update failed:', error)
      throw error
    }

    console.log('Report status updated via batch:', data)
    return data
  } catch (error) {
    console.error('Batch update method failed:', error)
    throw error
  }
}
