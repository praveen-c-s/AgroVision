import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, completeRequest } from "../../api/requestService.js";
import AIReport from "../../components/AIReport";

const CompletePage = () => {

  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= FETCH REQUEST ================= */

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {

      const response = await getRequest(requestId);
      setRequest(response);

    } catch (error) {
      setError("Failed to fetch request details");
    }
  };

  /* ================= COMPLETE REQUEST ================= */

  const handleComplete = async () => {

    if (!window.confirm(
      "Are you sure you want to complete this request? This will send the final results to the farmer."
    )) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      await completeRequest(requestId);

      setSuccess("Request completed successfully!");

      setTimeout(() => {
        navigate("/officer/assigned");
      }, 2000);

    } catch (error) {

      setError(
        error.response?.data?.error || "Failed to complete request"
      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= LOADING ================= */

  if (!request) {

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading request details...</div>
      </div>
    );

  }

  const imageUrl = request.image_path
    ? `http://localhost:5000/uploads/${request.image_path.split(/[/\\]/).pop()}`
    : null;

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* ================= HEADER ================= */}

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Complete Request
          </h1>
          <p className="text-gray-500 text-sm">
            Final review for request #{request._id}
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        {/* ================= REQUEST SUMMARY CARD ================= */}

        <div className="bg-white rounded-lg shadow-md p-6">

          <h3 className="text-lg font-semibold mb-4">
            Request Summary
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <p className="text-gray-500 text-sm">Request Type</p>
              <p className="font-medium">{request.request_type}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Farmer Name</p>
              <p className="font-medium">
                {request.farmer_name || "Unknown Farmer"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Description</p>
              <p>{request.description || "No description provided"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                {request.status}
              </span>
            </div>

          </div>

          {/* ================= IMAGE ================= */}

          {imageUrl && (

            <div className="mt-6">

              <h4 className="font-semibold mb-2">
                📷 Uploaded Image
              </h4>

              <img
                src={imageUrl}
                alt="Farmer Upload"
                className="w-48 h-48 object-cover rounded-lg border"
              />

              <button
                onClick={() => setPreviewImage(imageUrl)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Preview Image
              </button>

            </div>

          )}

        </div>

        {/* ================= FINAL RESULTS ================= */}

        <div className="bg-white rounded-lg shadow-md p-6">

          <h3 className="text-lg font-semibold mb-4">
            Final Results (AI + Officer Advisory)
          </h3>

          {request.prediction && (

            <AIReport

              prediction={request.prediction}
              aiAdvisory={request.ai_advisory}
              finalAdvisoryEN={request.final_advisory_en}
              finalAdvisoryML={request.final_advisory_ml}
              officerNotes={request.officer_notes}

            />

          )}

        </div>

        {/* ================= ACTION CARD ================= */}

        <div className="bg-white rounded-lg shadow-md p-6">

          <div className="flex justify-between items-center flex-wrap gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Completing this request will:
              </p>

              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Send final results to the farmer</li>
                <li>Mark request as completed</li>
                <li>Farmer can view the advisory and AI report</li>
              </ul>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => navigate("/officer/assigned")}
                className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>

              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Completing..." : "Complete Request"}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================= IMAGE PREVIEW MODAL ================= */}

      {previewImage && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >

          <div
            className="relative bg-white rounded-xl shadow-2xl p-4 max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

          </div>

        </div>

      )}

    </div>

  );

};

export default CompletePage;