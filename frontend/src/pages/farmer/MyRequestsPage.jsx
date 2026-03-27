import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RequestCard from "../../components/RequestCard.jsx";
import { getMyRequests } from "../../api/requestService.js";

const MyRequestsPage = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMyRequests();
      setRequests(response.data || []);
    } catch (error) {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.request_type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading your requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        <div className="px-4 py-6 sm:px-0">

          {/* HEADER */}

          <div className="mb-8 flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Requests
              </h1>

              <p className="mt-2 text-gray-600">
                Track all your agricultural requests and view results
              </p>
            </div>

            <Link
              to="/farmer/dashboard"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              New Request
            </Link>

          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* FILTERS */}

          <div className="flex gap-3 mb-6 flex-wrap">

            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("soil_test")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "soil_test"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Soil Test
            </button>

            <button
              onClick={() => setFilter("prediction")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "prediction"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Disease Detection
            </button>

            <button
              onClick={() => setFilter("crop")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "crop"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Crop Recommendation
            </button>

          </div>

          {/* EMPTY STATE */}

          {filteredRequests.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">

              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                📋
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No requests found
              </h3>

              <p className="text-gray-600">
                Try changing the filter or create a new request.
              </p>

            </div>
          ) : (

            <div>

              <p className="text-sm text-gray-600 mb-4">
                Showing {filteredRequests.length} request
                {filteredRequests.length !== 1 ? "s" : ""}
              </p>

              {filteredRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  role="farmer"
                />
              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default MyRequestsPage;