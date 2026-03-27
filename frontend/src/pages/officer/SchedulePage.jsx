import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, scheduleAppointment } from "../../api/requestService.js";

/* ---------- PARSE FARMER DESCRIPTION ---------- */
const parseDescription = (description) => {
  const result = {};

  if (!description) return result;

  description.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      result[key.trim()] = rest.join(":").trim();
    }
  });

  return result;
};

const SchedulePage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [scheduleData, setScheduleData] = useState({
    appointment_date: "",
  });

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

  const handleScheduleChange = (e) => {
    setScheduleData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await scheduleAppointment(requestId, scheduleData);

      setSuccess("Appointment scheduled successfully!");

      setTimeout(() => {
        navigate("/officer/assigned");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to schedule appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading request details...</div>
      </div>
    );
  }

  const details = parseDescription(request.description);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule Soil Test Appointment
          </h1>

          <p className="text-gray-500 mt-2">
            Request ID:
            <span className="font-semibold ml-1">
              {request._id.slice(-8)}
            </span>
          </p>
        </div>

        {/* REQUEST SUMMARY */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Request Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Request Type</p>
              <p className="font-semibold capitalize">
                {request.request_type}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Farmer ID</p>
              <p className="font-semibold">
                {request.farmer_id?.slice(-6)}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Status</p>

              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                {request.status}
              </span>
            </div>

          </div>

        </div>

        {/* FARM INFORMATION */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Farm Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Farm Address</p>
              <p className="font-medium">{details["Farm Address"]}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Farm Area</p>
              <p className="font-medium">{details["Farm Area"]}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Current Crop</p>
              <p className="font-medium">{details["Current Crop"]}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Planned Crop</p>
              <p className="font-medium">{details["Planned Crop"]}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Preferred Visit Time</p>
              <p className="font-medium">{details["Preferred Visit Time"]}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-xs text-gray-500">Contact Number</p>
              <p className="font-medium">{details["Contact Number"]}</p>
            </div>

          </div>

          {details["Additional Notes"] && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Additional Notes</p>
              <p className="mt-1">{details["Additional Notes"]}</p>
            </div>
          )}

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* APPOINTMENT FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6"
        >

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Appointment Details
          </h2>

          <label className="block text-sm font-medium text-gray-600">
            Select Date & Time
          </label>

          <input
            type="datetime-local"
            name="appointment_date"
            value={scheduleData.appointment_date}
            onChange={handleScheduleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="mt-2 w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-end gap-4 mt-6">

            <button
              type="button"
              onClick={() => navigate("/officer/assigned")}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default SchedulePage;