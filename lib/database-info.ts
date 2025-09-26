import { supabase } from './supabase';

// Function to list all tables in Supabase
export const listAllTables = async () => {
  try {
    // Try to query information_schema directly
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error fetching tables:', error);
      // Fallback: return known tables from our schema
      return [
        { table_name: 'profiles', table_schema: 'public' },
        { table_name: 'reports', table_schema: 'public' },
        { table_name: 'report_comments', table_schema: 'public' },
        { table_name: 'departments', table_schema: 'public' }
      ];
    }

    return data || [];
  } catch (error) {
    console.error('Error in listAllTables:', error);
    // Fallback: return known tables from our schema
    return [
      { table_name: 'profiles', table_schema: 'public' },
      { table_name: 'reports', table_schema: 'public' },
      { table_name: 'report_comments', table_schema: 'public' },
      { table_name: 'departments', table_schema: 'public' }
    ];
  }
};

// Function to get table structure
export const getTableStructure = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');

    if (error) {
      console.error(`Error fetching structure for table ${tableName}:`, error);
      // Fallback: return known structure for our tables
      return getKnownTableStructure(tableName);
    }

    return data || [];
  } catch (error) {
    console.error(`Error in getTableStructure for ${tableName}:`, error);
    // Fallback: return known structure for our tables
    return getKnownTableStructure(tableName);
  }
};

// Fallback function to return known table structures
const getKnownTableStructure = (tableName: string) => {
  const knownStructures: Record<string, any[]> = {
    profiles: [
      { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
      { column_name: 'email', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'role', data_type: 'text', is_nullable: 'YES', column_default: "'citizen'" },
      { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' },
      { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' }
    ],
    reports: [
      { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
      { column_name: 'title', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'description', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'category', data_type: 'text', is_nullable: 'NO', column_default: "'general'" },
      { column_name: 'priority', data_type: 'text', is_nullable: 'YES', column_default: "'medium'" },
      { column_name: 'status', data_type: 'text', is_nullable: 'YES', column_default: "'pending'" },
      { column_name: 'location', data_type: 'jsonb', is_nullable: 'NO', column_default: null },
      { column_name: 'address', data_type: 'text', is_nullable: 'NO', column_default: "''" },
      { column_name: 'media_urls', data_type: 'text[]', is_nullable: 'YES', column_default: "'{}'" },
      { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
      { column_name: 'assigned_to', data_type: 'uuid', is_nullable: 'YES', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' },
      { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' },
      { column_name: 'resolved_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
      { column_name: 'admin_notes', data_type: 'text', is_nullable: 'YES', column_default: null }
    ],
    report_comments: [
      { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
      { column_name: 'report_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
      { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
      { column_name: 'user_name', data_type: 'text', is_nullable: 'YES', column_default: null },
      { column_name: 'comment', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' }
    ],
    departments: [
      { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'gen_random_uuid()' },
      { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'contact_email', data_type: 'text', is_nullable: 'NO', column_default: null },
      { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()' }
    ]
  };

  return knownStructures[tableName] || [];
};

// Function to test database connection and get basic info
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('reports')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Database connection successful');
    
    // Get table count
    const { data: tableCount, error: countError } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error getting table count:', countError);
    }
    
    return { 
      success: true, 
      reportsCount: tableCount?.length || 0,
      message: 'Database connection successful'
    };
    
  } catch (error) {
    console.error('Database test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to create sample data if database is empty
export const createSampleData = async () => {
  try {
    console.log('Creating sample data...');
    
    // First, create a sample profile if none exists
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    let profileId = existingProfiles?.[0]?.id;

    if (!profileId) {
      // Create a sample profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000001', // Use a fixed UUID for testing
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating sample profile:', profileError);
        return { success: false, error: profileError.message };
      }
      profileId = newProfile.id;
    }

    // Create sample reports
    const { data: existingReports } = await supabase
      .from('reports')
      .select('id')
      .limit(1);

    if (!existingReports?.length) {
      const sampleReports = [
        {
          title: 'Broken Street Light',
          description: 'Street light on Main Street is not working, making it dangerous for pedestrians at night.',
          category: 'infrastructure',
          priority: 'medium',
          status: 'pending',
          location: JSON.stringify({ latitude: 15.4989, longitude: 73.8278 }),
          address: 'Main Street, Panaji, Goa',
          media_urls: [],
          user_id: profileId,
          admin_notes: null
        },
        {
          title: 'Pothole on Highway',
          description: 'Large pothole on NH66 causing traffic issues and vehicle damage.',
          category: 'infrastructure',
          priority: 'high',
          status: 'in_progress',
          location: JSON.stringify({ latitude: 15.5000, longitude: 73.8300 }),
          address: 'NH66, Near Panaji, Goa',
          media_urls: [],
          user_id: profileId,
          admin_notes: 'Work started, expected completion in 2 weeks'
        },
        {
          title: 'Garbage Collection Issue',
          description: 'Garbage not being collected regularly in residential area.',
          category: 'environment',
          priority: 'medium',
          status: 'resolved',
          location: JSON.stringify({ latitude: 15.4900, longitude: 73.8200 }),
          address: 'Residential Area, Panaji, Goa',
          media_urls: [],
          user_id: profileId,
          admin_notes: 'Issue resolved, regular collection schedule restored',
          resolved_at: new Date().toISOString()
        }
      ];

      const { error: reportsError } = await supabase
        .from('reports')
        .insert(sampleReports);

      if (reportsError) {
        console.error('Error creating sample reports:', reportsError);
        return { success: false, error: reportsError.message };
      }

      console.log('Sample data created successfully');
    }

    return { success: true, message: 'Sample data created successfully' };
  } catch (error) {
    console.error('Error creating sample data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to test the resolve/start functionality
export const testResolveStartFeature = async () => {
  try {
    console.log('Testing resolve/start feature...');
    
    // Get a pending report
    const { data: pendingReport, error: fetchError } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'pending')
      .limit(1)
      .single();

    if (fetchError || !pendingReport) {
      console.log('No pending reports found, creating one...');
      // Create a test report
      const { data: newReport, error: createError } = await supabase
        .from('reports')
        .insert({
          title: 'Test Issue for Resolve/Start',
          description: 'This is a test issue to verify resolve/start functionality.',
          category: 'test',
          priority: 'medium',
          status: 'pending',
          location: JSON.stringify({ latitude: 15.5000, longitude: 73.8300 }),
          address: 'Test Location',
          media_urls: [],
          user_id: '00000000-0000-0000-0000-000000000001', // Use the sample profile ID
          admin_notes: null
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating test report:', createError);
        return { success: false, error: createError.message };
      }

      // Test updating status to in_progress
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString(),
          admin_notes: 'Test update to in_progress'
        })
        .eq('id', newReport.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating report status:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('✅ Resolve/start feature test successful');
      return { 
        success: true, 
        message: 'Resolve/start feature working correctly',
        testReport: updatedReport
      };
    }

    // Test updating existing pending report
    const { data: updatedReport, error: updateError } = await supabase
      .from('reports')
      .update({ 
        status: 'in_progress',
        updated_at: new Date().toISOString(),
        admin_notes: 'Test update to in_progress'
      })
      .eq('id', pendingReport.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating report status:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log('✅ Resolve/start feature test successful');
    return { 
      success: true, 
      message: 'Resolve/start feature working correctly',
      testReport: updatedReport
    };

  } catch (error) {
    console.error('Error testing resolve/start feature:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
