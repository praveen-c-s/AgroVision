import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitRequest } from "../../api/requestService.js";

const SubmitCropPage = () => {

  const [formData, setFormData] = useState({
    description: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /* ================= FILE SELECT ================= */

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF soil report.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setError("");
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ================= QUICK SUGGESTIONS ================= */

  const addSuggestion = (text) => {

    if (formData.description.includes(text)) return;

    setFormData({
      ...formData,
      description: formData.description
        ? formData.description + "\n" + text
        : text
    });

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please upload a soil report PDF.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("soil_report", selectedFile);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("request_type", "crop");

    try {

      await submitRequest(formDataToSend);

      setSuccess(
        "Request submitted successfully! You will be notified once analysis is complete."
      );

      setTimeout(() => {
        navigate("/farmer/my-requests");
      }, 2000);

    } catch (err) {

      setError(err.response?.data?.error || "Failed to submit request");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-3xl mx-auto py-8 px-4">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Submit Crop Recommendation Request
          </h1>

          <p className="text-gray-600 mt-2">
            Upload your soil test report to receive AI-based crop recommendations.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 space-y-6"
        >

          {/* ERROR */}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded">
              {success}
            </div>
          )}

          {/* ================= SOIL REPORT UPLOAD ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soil Report PDF *
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">

              <input
                id="soil_report"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <label htmlFor="soil_report" className="cursor-pointer">

                {selectedFile ? (

                  <div className="space-y-3">

                    <div className="text-4xl">📄</div>

                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile.name}
                    </p>

                    <div className="flex justify-center gap-3">

                      <button
                        type="button"
                        onClick={() => window.open(previewURL)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        View Report
                      </button>

                      <label
                        htmlFor="soil_report"
                        className="px-3 py-1 bg-gray-200 rounded text-sm cursor-pointer"
                      >
                        Change File
                      </label>

                    </div>

                  </div>

                ) : (

                  <div>

                    <div className="text-4xl mb-2">📄</div>

                    <p className="text-gray-600">
                      Click to upload soil report
                    </p>

                    <p className="text-xs text-gray-500">
                      PDF files up to 10MB
                    </p>

                  </div>

                )}

              </label>

            </div>

          </div>

          {/* ================= QUICK FARM DETAILS ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Farm Details
            </label>

            <p className="text-xs text-gray-500 mb-3">
              (Optional – helps improve crop recommendations)
            </p>

            {/* Previous Crop */}

            <p className="text-xs text-gray-600 mb-1">Previous Crop</p>

            <div className="flex flex-wrap gap-2 mb-4">

              <button type="button" onClick={() => addSuggestion("Previous crop: Rice")} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Rice</button>

              <button type="button" onClick={() => addSuggestion("Previous crop: Corn")} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Corn</button>

              <button type="button" onClick={() => addSuggestion("Previous crop: Banana")} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Banana</button>

              <button type="button" onClick={() => addSuggestion("Previous crop: None (First cultivation)")} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">None / First Crop</button>

            </div>

            {/* Irrigation */}

            <p className="text-xs text-gray-600 mb-1">Irrigation</p>

            <div className="flex flex-wrap gap-2 mb-4">

              <button type="button" onClick={() => addSuggestion("Irrigation: Borewell")} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Borewell</button>

              <button type="button" onClick={() => addSuggestion("Irrigation: Canal")} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Canal</button>

              <button type="button" onClick={() => addSuggestion("Irrigation: Rainfed")} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Rainfed</button>

              <button type="button" onClick={() => addSuggestion("Irrigation: Drip")} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Drip</button>

              <button type="button" onClick={() => addSuggestion("Irrigation: Other")} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">Other</button>

            </div>

            {/* Soil Type */}

            <p className="text-xs text-gray-600 mb-1">Soil Type</p>

            <div className="flex flex-wrap gap-2">

              <button type="button" onClick={() => addSuggestion("Soil type: Sandy")} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Sandy</button>

              <button type="button" onClick={() => addSuggestion("Soil type: Clay")} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Clay</button>

              <button type="button" onClick={() => addSuggestion("Soil type: Loamy")} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Loamy</button>

              <button type="button" onClick={() => addSuggestion("Soil type: Not sure")} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">Not Sure</button>

            </div>

          </div>

          {/* ================= DESCRIPTION ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>

            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder={`Example:
• Previous crop grown
• Irrigation type
• Soil type
• Fertilizer used previously
• Problems faced in last crop`}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />

          </div>

          {/* ================= INFO CARD ================= */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              What we analyze from your soil report
            </h4>

            <ul className="text-sm text-blue-700 space-y-1">

              <li>• Soil pH level</li>
              <li>• Nutrient levels (Nitrogen, Phosphorus, Potassium)</li>
              <li>• Soil fertility</li>
              <li>• Environmental suitability</li>
              <li>• Best crops for your land</li>

            </ul>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/farmer/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default SubmitCropPage;