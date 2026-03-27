import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingRequests } from '../../api/requestService.js';

const OfficerDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const pending = await getPendingRequests();
      setStats({
        pending: pending.data?.length || 0,
        assigned: 0, // Would need another API call
        completed: 0, // Would need another API call
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage agricultural requests and provide expert analysis</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/officer/pending"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                      ⏳
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/officer/assigned"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      📋
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assigned Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      ✅
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/officer/pending"
                    className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">View Pending Requests</span>
                      <span className="text-gray-400">→</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Review and claim new requests</p>
                  </Link>
                  
                  <Link
                    to="/officer/assigned"
                    className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">My Assigned Requests</span>
                      <span className="text-gray-400">→</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Continue working on assigned requests</p>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Workflow Guide
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-800">
                        1
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <strong>Claim Request:</strong> Accept requests from your district
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-800">
                        2
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <strong>Process AI:</strong> Run AI analysis on uploaded data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-800">
                        3
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <strong>Review Results:</strong> Add expert recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                        4
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <strong>Complete:</strong> Send final report to farmer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
