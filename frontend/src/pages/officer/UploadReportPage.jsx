import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest, uploadSoilReport } from '../../api/requestService.js';

const UploadReportPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await getRequest(requestId);
      setRequest(response.data);
    } catch (error) {
      setError('Failed to fetch request details');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await uploadSoilReport(requestId, selectedFile);
      setSuccess('Soil report uploaded successfully!');
      
      // Redirect to assigned requests after 2 seconds
      setTimeout(() => {
        navigate('/officer/assigned');
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading request details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Soil Report</h1>
            <p className="mt-2 text-gray-600">
              Upload soil analysis report for request #{request._id}
            </p>
          </div>

          {/* Request Details */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Request Type</p>
                <p className="font-medium">{request.request_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Farmer ID</p>
                <p className="font-medium">{request.farmer_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{request.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {request.status}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Upload Soil Report PDF</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="soil_report" className="block text-sm font-medium text-gray-700">
                  Soil Report (PDF)
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload the complete soil analysis report in PDF format. This will be available for the farmer to download.
                </p>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4v-4a4 4 0 00-4-4H12a4 4 0 00-4 4v4m0 0v8a4 4 0 004 4h16a4 4 0 004-4v-4z"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="soil_report"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <span>Upload a file</span>
                      </label>
                      <input
                        id="soil_report"
                        name="soil_report"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Selected file: {selectedFile.name}</p>
                      <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/officer/assigned`)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadReportPage;
