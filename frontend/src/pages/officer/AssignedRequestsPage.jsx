import React, { useState, useEffect } from 'react';
import RequestCard from '../../components/RequestCard.jsx';
import { getAssignedRequests } from '../../api/requestService.js';
import { claimRequest } from '../../api/requestService.js';
import { useNavigate } from 'react-router-dom';

const AssignedRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedRequests();
  }, []);

  const fetchAssignedRequests = async () => {
    try {
      const response = await getAssignedRequests();
      setRequests(response.data || []);
    } catch (error) {
      setError('Failed to fetch assigned requests');
    } finally {
      setLoading(false);
    }
  };

  // Claim request (if needed)
  const handleClaim = async (id) => {
    try {
      await claimRequest(id);
      fetchAssignedRequests();
    } catch (err) {
      console.error("Claim failed");
    }
  };

  // Navigate to schedule page
  const handleSchedule = (id) => {
    navigate(`/officer/schedule/${id}`);
  };

  // Navigate to submit report page
  const handleSubmitReport = (id) => {
    navigate(`/officer/submit-report/${id}`);
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading assigned requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        <div className="px-4 py-6 sm:px-0">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Assigned Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Manage requests you're currently working on
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['all', 'assigned', 'ai_generated', 'reviewed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === status
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status
                    .replace('_', ' ')
                    .charAt(0)
                    .toUpperCase() +
                    status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </nav>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                📋
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assigned requests
              </h3>

              <p className="text-gray-600 mb-4">
                You don't have any assigned requests in this category.
              </p>

              <a
                href="/officer/pending"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View Pending Requests
              </a>
            </div>
          ) : (

            <div>

              {/* Request Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Request Cards */}
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  role="officer"
                  onClaim={handleClaim}
                  onSchedule={handleSchedule}
                  onSubmitReport={handleSubmitReport}
                />
              ))}

            </div>

          )}

        </div>
      </div>
    </div>
  );
};

export default AssignedRequestsPage;