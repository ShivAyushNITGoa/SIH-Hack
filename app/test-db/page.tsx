'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAllReports, updateReportStatus } from '@/lib/queries';
import { 
  testDatabaseConnection, 
  createSampleData, 
  testResolveStartFeature,
  listAllTables,
  getTableStructure 
} from '@/lib/database-info';
import { updateAllUsersToCorrectRole, updateUserRole } from '@/lib/auth';
import IssuesMap from '@/components/IssuesMap';
import UsersDebug from '@/components/UsersDebug';

export default function TestDBPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [tableStructures, setTableStructures] = useState<Record<string, any[]>>({});
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing database connection...');
      
      // Test basic connection
      const connectionResult = await testDatabaseConnection();
      setConnectionStatus(connectionResult);
      
      if (!connectionResult.success) {
        throw new Error(connectionResult.error);
      }
      
      // Get all tables
      const tablesData = await listAllTables();
      setTables(tablesData);
      console.log('Tables found:', tablesData);
      
      // Get table structures
      const structures: Record<string, any[]> = {};
      for (const table of tablesData) {
        const structure = await getTableStructure(table.table_name);
        structures[table.table_name] = structure;
      }
      setTableStructures(structures);
      
        // Test getting reports
        const reportsData = await getAllReports();
        setReports(reportsData);
        
        console.log(`✅ Found ${reportsData.length} reports`);
        
        if (reportsData.length > 0) {
          console.log('Sample report:', reportsData[0]);
        }
        
        // Get profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          setProfiles(profilesData || []);
          console.log(`✅ Found ${profilesData?.length || 0} profiles`);
        }
      
    } catch (err) {
      console.error('Database test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testUpdateStatus = async (reportId: string) => {
    try {
      console.log('Testing status update for report:', reportId);
      await updateReportStatus(reportId, 'in_progress');
      console.log('✅ Status update successful');
      testDatabase(); // Refresh data
    } catch (err) {
      console.error('Status update failed:', err);
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const createSample = async () => {
    try {
      setLoading(true);
      const result = await createSampleData();
      if (result.success) {
        console.log('Sample data created successfully');
        testDatabase(); // Refresh data
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error creating sample data:', err);
      setError(err instanceof Error ? err.message : 'Failed to create sample data');
    } finally {
      setLoading(false);
    }
  };

  const testResolveStart = async () => {
    try {
      setLoading(true);
      const result = await testResolveStartFeature();
      if (result.success) {
        console.log('Resolve/start feature test successful');
        testDatabase(); // Refresh data
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error testing resolve/start feature:', err);
      setError(err instanceof Error ? err.message : 'Failed to test resolve/start feature');
    } finally {
      setLoading(false);
    }
  };

  const updateAllUsersToCorrectRole = async () => {
    try {
      setLoading(true);
      console.log('Updating all users to correct role based on email domain...');
      const updatedProfiles = await updateAllUsersToCorrectRole();
      console.log(`Updated ${updatedProfiles.length} users to correct roles`);
      testDatabase(); // Refresh data
    } catch (err) {
      console.error('Error updating users to correct role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update users to correct role');
    } finally {
      setLoading(false);
    }
  };

  const testUsersPageQuery = async () => {
    try {
      setLoading(true);
      console.log('Testing users page query...');
      
      // Test the exact same query that the users page uses
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users page query result:', { data, error });
      
      if (error) {
        console.error('Users page query failed:', error);
        setError(`Users page query failed: ${error.message}`);
      } else {
        console.log(`Users page query successful: ${data?.length || 0} users found`);
        toast.success(`Users page query successful: ${data?.length || 0} users found`);
      }
    } catch (err) {
      console.error('Error testing users page query:', err);
      setError(err instanceof Error ? err.message : 'Failed to test users page query');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Database Test & Debug</h1>
        <p>Testing database connection and loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Test & Debug</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Connection Status */}
      {connectionStatus && (
        <div className={`mb-6 p-4 rounded ${connectionStatus.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
          <h2 className="font-semibold mb-2">Connection Status</h2>
          <p><strong>Status:</strong> {connectionStatus.success ? '✅ Connected' : '❌ Failed'}</p>
          <p><strong>Message:</strong> {connectionStatus.message || connectionStatus.error}</p>
          {connectionStatus.reportsCount !== undefined && (
            <p><strong>Reports Count:</strong> {connectionStatus.reportsCount}</p>
          )}
        </div>
      )}
      
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button 
            onClick={testDatabase}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🔄 Refresh Data
          </button>
          <button 
            onClick={createSample}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            📝 Create Sample Data
          </button>
          <button 
            onClick={testResolveStart}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            🔧 Test Resolve/Start Feature
          </button>
          <button 
            onClick={updateAllUsersToCorrectRole}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            👑 Fix User Roles (Email-based)
          </button>
          <button 
            onClick={testUsersPageQuery}
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
          >
            🔍 Test Users Page Query
          </button>
        </div>
      
      {/* Tables Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📊 Supabase Tables ({tables.length})</h2>
        {tables.length === 0 ? (
          <p className="text-gray-600">No tables found or unable to fetch table information.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.table_name} className="border p-4 rounded bg-white shadow">
                <h3 className="font-semibold text-lg mb-2">{table.table_name}</h3>
                <p className="text-sm text-gray-600 mb-2">Schema: {table.table_schema}</p>
                {tableStructures[table.table_name] && (
                  <div>
                    <p className="text-sm font-medium mb-1">Columns ({tableStructures[table.table_name].length}):</p>
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {tableStructures[table.table_name].map((column) => (
                        <div key={column.column_name} className="flex justify-between">
                          <span className="font-mono">{column.column_name}</span>
                          <span className="text-gray-500">{column.data_type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
        {/* Profiles Data */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">👥 User Profiles ({profiles.length})</h2>
          
          {profiles.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p><strong>No profiles found in database.</strong></p>
              <p className="mt-2">Profiles are created automatically when users sign up.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => {
                const isAdminEmail = profile.email.endsWith('@nitgoa.ac.in') || profile.email.endsWith('@gmail.com')
                const expectedRole = isAdminEmail ? 'admin' : 'citizen'
                const roleIsCorrect = profile.role === expectedRole
                
                return (
                  <div key={profile.id} className={`border p-4 rounded bg-white shadow ${!roleIsCorrect ? 'border-red-300 bg-red-50' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          profile.role === 'admin' ? 'bg-green-100 text-green-800' :
                          profile.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profile.role}
                        </span>
                        {!roleIsCorrect && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            Should be: {expectedRole}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
                    <div className="text-xs text-gray-500">
                      <p>Domain: {profile.email.split('@')[1]}</p>
                      <p>Expected Role: {expectedRole}</p>
                      <p>ID: {profile.id}</p>
                      <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Users Debug Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">👥 Users Page Debug</h2>
          <UsersDebug />
        </div>

        {/* Reports Data */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📋 Reports ({reports.length})</h2>
        
        {reports.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p><strong>No reports found in database.</strong></p>
            <p className="mt-2">Click "Create Sample Data" to add test reports.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.slice(0, 10).map((report) => (
              <div key={report.id} className="border p-4 rounded bg-white shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    <p>ID: {report.id}</p>
                    <p>Category: {report.category} | Priority: {report.priority}</p>
                    <p>Created: {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => testUpdateStatus(report.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => testUpdateStatus(report.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {report.status === 'in_progress' && (
                      <button
                        onClick={() => testUpdateStatus(report.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Environment Variables Check */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔧 Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p><strong>Maps:</strong> OpenLayers + OSM (no API key required)</p>
        </div>
      </div>

      {/* Map Test */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🗺️ Map Test (OpenLayers)</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <IssuesMap 
            height="300px"
            onIssueClick={(issue) => {
              console.log('Map issue clicked:', issue);
            }}
          />
        </div>
      </div>
    </div>
  );
}
