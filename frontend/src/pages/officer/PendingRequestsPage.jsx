import React, { useState, useEffect } from 'react';
import RequestCard from '../../components/RequestCard.jsx';
import { getPendingRequests, claimRequest } from '../../api/requestService.js';

const PendingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await getPendingRequests();
      setRequests(response.data || []);
    } catch (error) {
  if (error.response?.data?.message === "Officer approval pending") {
    setError("Waiting for admin approval");
  } else {
    setError("Failed to fetch pending requests");
  }
} finally {
      setLoading(false);
    }
  };

  const handleClaim = async (requestId) => {
    try {
      await claimRequest(requestId);
      // Refresh the list
      fetchPendingRequests();
    } catch (error) {
      setError('Failed to claim request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading pending requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pending Requests</h1>
            <p className="mt-2 text-gray-600">Review and claim requests from your district</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {requests.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                ✅
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">
                There are no pending requests in your district at the moment.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {requests.length} pending request{requests.length !== 1 ? 's' : ''}
                </p>
              </div>

              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  role="officer"
                  onClaim={handleClaim}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsPage;
