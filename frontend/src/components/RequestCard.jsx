import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestCard = ({ request, role, onClaim }) => {

  const navigate = useNavigate();

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "ai_generated":
        return "bg-purple-100 text-purple-800";
      case "reviewed":
        return "bg-orange-100 text-orange-800";
      case "scheduled":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const getRequestIcon = () => {
    if (request.request_type === "soil_test") return "🧪";
    if (request.request_type === "prediction") return "📷";
    if (request.request_type === "crop") return "🌱";
    return "📋";
  };

  const getRequestLabel = () => {
    switch (request.request_type) {
      case "prediction":
        return "Disease Detection";
      case "crop":
        return "Crop Recommendation";
      case "soil_test":
        return "Soil Test";
      default:
        return "Request";
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 mb-5">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">

          <div>

            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getRequestIcon()}
              {getRequestLabel()}
            </h3>

            <p className="text-gray-600 text-sm">
              👨‍🌾 Farmer: {request.farmer_name || "Unknown"}
            </p>

            <p className="text-gray-600 text-sm">
              📅 Submitted: {formatDate(request.created_at)}
            </p>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {request.status?.replace("_", " ")}
          </span>

        </div>

        {/* IMAGE PREVIEW BUTTON */}
        {request.request_type === "prediction" && request.image_path && (
          <div className="mb-4">
            <button
              onClick={() => setShowImagePreview(true)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              Preview Image
            </button>
          </div>
        )}

        {/* PDF PREVIEW BUTTON */}
        {request.request_type === "crop" && request.soil_report_path && (
          <div className="mb-4">
            <button
              onClick={() => setShowPDFPreview(true)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              Preview Soil Report
            </button>
          </div>
        )}

        {/* DESCRIPTION */}
        {request.description && (
          <div className="mb-4 text-gray-700 text-sm">
            <strong>Details:</strong> {request.description}
          </div>
        )}

        {/* APPOINTMENT */}
        {request.appointment_date && (
          <div className="mb-4 p-4 bg-blue-50 rounded-md">

            <h4 className="font-semibold mb-2">
              📅 Appointment Scheduled
            </h4>

            <p>
              <strong>Date:</strong> {formatDate(request.appointment_date)}
            </p>

            {request.appointment_location && (
              <p>
                <strong>Location:</strong> {request.appointment_location}
              </p>
            )}

          </div>
        )}

        {/* ================= OFFICER ACTIONS ================= */}

        {role === "officer" && (

          <div className="mt-4 flex flex-wrap gap-2">

            {request.status === "pending" && onClaim && (
              <button
                onClick={() => onClaim(request._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Claim Request
              </button>
            )}

            {request.status === "assigned" && (
              <>
                {request.request_type !== "soil_test" && (
                  <button
                    onClick={() =>
                      navigate(`/officer/process/${request._id}`)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Process with AI
                  </button>
                )}

                {request.request_type === "soil_test" && (
                  <button
                    onClick={() =>
                      navigate(`/officer/schedule/${request._id}`)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    Schedule Appointment
                  </button>
                )}
              </>
            )}

            {request.status === "ai_generated" && (
              <button
                onClick={() =>
                  navigate(`/officer/review/${request._id}`)
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Review Results
              </button>
            )}

            {request.status === "reviewed" &&
              request.request_type !== "soil_test" && (
                <button
                  onClick={() =>
                    navigate(`/officer/complete/${request._id}`)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Complete Request
                </button>
              )}

            {request.request_type === "soil_test" &&
              request.status === "scheduled" && (
                <button
                  onClick={() =>
                    navigate(`/officer/submit-report/${request._id}`)
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  Upload Soil Report
                </button>
              )}

          </div>

        )}

        {/* ================= FARMER ACTIONS ================= */}

        {role === "farmer" && (

          <div className="mt-4 flex flex-wrap gap-2">

            {request.status === "completed" &&
              request.request_type !== "soil_test" && (
                <button
                  onClick={() =>
                    navigate(`/farmer/view/${request._id}`)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  View Final Report
                </button>
              )}

            {request.request_type === "soil_test" &&
              request.status === "completed" && (
                <button
onClick={async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/requests/${request._id}/download-report`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      alert("Failed to download report");
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "soil_report.pdf";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Download error:", error);
    alert("Download failed");
  }
}}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Download Soil Report
                </button>
              )}

          </div>

        )}

      </div>

      {/* IMAGE MODAL */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <div className="bg-white p-4 rounded-lg max-w-4xl">

            <img
              src={`http://localhost:5000/${request.image_path}`}
              alt="plant"
              className="max-h-[80vh] rounded"
            />

            <button
              onClick={() => setShowImagePreview(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* PDF MODAL */}
      {showPDFPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

          <div className="bg-white p-4 rounded-lg w-[80%] h-[80%]">

            <iframe
              src={`http://localhost:5000/${request.soil_report_path}`}
              title="soil-report"
              className="w-full h-full"
            />

            <button
              onClick={() => setShowPDFPreview(false)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </>
  );
};

export default RequestCard;