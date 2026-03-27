import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, submitReport } from "../../api/requestService.js";

const SubmitReportPage = () => {

  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {

    try {

      const response = await getRequest(requestId);
      setRequest(response);

    } catch {

      setError("Failed to fetch request details");

    }

  };

  const handleFileChange = (e) => {

    setReportFile(e.target.files[0]);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!reportFile) {

      setError("Please upload a PDF report");
      return;

    }

    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("soil_report", reportFile);

    try {

      await submitReport(requestId, formData);

      setSuccess("Report uploaded successfully!");

      setTimeout(() => {
        navigate("/officer/completed");
      }, 1500);

    } catch (err) {

      setError(err.response?.data?.error || "Upload failed");

    } finally {

      setLoading(false);

    }

  };

  if (!request) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading request...</p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            🧪 Upload Soil Test Report
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Request ID: {request._id.slice(-8)}
          </p>

        </div>

        {/* REQUEST INFO CARD */}

        <div className="bg-white shadow-md border rounded-xl p-6">

          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            📋 Request Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">

            <Info label="Request Type" value={request.request_type} />

            <Info
              label="Farmer ID"
              value={request.farmer_id?.slice(-6)}
            />

          </div>

          <div className="mt-4">

            <p className="text-gray-500 text-xs mb-1">
              Description
            </p>

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {request.description}
            </p>

          </div>

        </div>

        {/* ERROR ALERT */}

        {error && (

          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm p-3 rounded">
            {error}
          </div>

        )}

        {/* SUCCESS ALERT */}

        {success && (

          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 text-sm p-3 rounded">
            {success}
          </div>

        )}

        {/* UPLOAD FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border shadow-md rounded-xl p-6 space-y-5"
        >

          <h3 className="text-lg font-semibold text-gray-800">
            📄 Upload Soil Report
          </h3>

          {/* FILE UPLOAD BOX */}

          <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-xl p-8 text-center hover:border-green-500 transition">

            <div className="text-4xl mb-3">
              📄
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">
              Drag & drop soil report or select file
            </p>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block mx-auto text-sm"
            />

            <p className="text-xs text-gray-500 mt-3">
              Accepted format: PDF soil laboratory report
            </p>

            {reportFile && (

              <p className="text-sm text-green-700 mt-3 font-medium">
                ✔ Selected: {reportFile.name}
              </p>

            )}

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/officer/assigned")}
              className="px-6 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Submit Report"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

/* ---------- INFO COMPONENT ---------- */

const Info = ({ label, value }) => (

  <div>

    <p className="text-gray-500 text-xs">
      {label}
    </p>

    <p className="font-medium text-gray-800">
      {value}
    </p>

  </div>

);

export default SubmitReportPage;