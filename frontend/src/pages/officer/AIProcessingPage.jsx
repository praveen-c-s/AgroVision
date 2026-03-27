import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRequest,
  processRequest,
  extractSoil
} from "../../api/requestService.js";

const AIProcessingPage = () => {

  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const [analysisType, setAnalysisType] = useState({
    disease: false,
    pest: false,
    crop: false
  });

  const [soilOverride, setSoilOverride] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
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

  const handleAnalysisChange = (type) => {
    setAnalysisType(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSoilChange = (e) => {
    setSoilOverride(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAutoExtract = async () => {

    if (!request?.soil_report_path) {
      setError("No soil report uploaded for this request");
      return;
    }

    try {

      const soilData = await extractSoil(requestId);

      setSoilOverride({
        N: soilData.N || "",
        P: soilData.P || "",
        K: soilData.K || "",
        temperature: soilData.temperature || "",
        humidity: soilData.humidity || "",
        ph: soilData.ph || "",
        rainfall: soilData.rainfall || ""
      });

      setSuccess("Soil values extracted from PDF");

    } catch (error) {
      setError("Failed to extract soil values");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const selectedTypes = Object.keys(analysisType).filter(
        key => analysisType[key]
      );

      if (selectedTypes.length === 0) {
        setError("Please select at least one analysis type");
        setLoading(false);
        return;
      }

      const processData = {
        analysis_type: selectedTypes,
        soil_override: analysisType.crop ? soilOverride : null
      };

      await processRequest(requestId, processData);

      setSuccess("AI processing completed successfully!");

      setTimeout(() => {
        navigate(`/officer/review/${requestId}`);
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.error || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading request...</div>
      </div>
    );
  }

  const imageUrl = request.image_path
    ? `http://localhost:5000/uploads/${request.image_path.split(/[/\\]/).pop()}`
    : null;

  const pdfUrl = request.soil_report_path
    ? `http://localhost:5000/uploads/${request.soil_report_path.split(/[/\\]/).pop()}`
    : null;

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🤖 AI Processing
          </h1>
          <p className="text-gray-500 text-sm">
            Process request #{request._id}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        {/* REQUEST DETAILS CARD */}

        <div className="bg-white rounded-lg shadow-md p-6">

          <h3 className="text-lg font-semibold mb-4">
            📄 Request Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <p className="text-gray-500 text-sm">Request Type</p>
              <p className="font-medium">{request.request_type}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Farmer Name</p>
              <p className="font-medium">{request.farmer_name}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Description</p>
              <p>{request.description}</p>
            </div>

            {request.crop && (
              <div>
                <p className="text-gray-500 text-sm">Crop</p>
                <p>{request.crop}</p>
              </div>
            )}

            {request.symptoms && (
              <div>
                <p className="text-gray-500 text-sm">Symptoms</p>
                <p>{request.symptoms}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {request.status}
              </span>
            </div>

          </div>

        </div>

        {/* IMAGE CARD */}

        {imageUrl && (

          <div className="bg-white rounded-lg shadow-md p-6">

            <h3 className="text-lg font-semibold mb-4">
              📷 Uploaded Image
            </h3>

            <img
              src={imageUrl}
              alt="plant"
              className="w-48 h-48 object-cover rounded-lg border"
            />

            <button
              onClick={() => setPreviewImage(imageUrl)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Preview Image
            </button>

          </div>

        )}

        {/* SOIL REPORT CARD */}

        {pdfUrl && (

          <div className="bg-white rounded-lg shadow-md p-6">

            <h3 className="text-lg font-semibold mb-4">
              🧪 Soil Report
            </h3>

            <button
              onClick={() => setPreviewPdf(pdfUrl)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Preview Soil Report
            </button>

          </div>

        )}

        {/* AI ANALYSIS CARD */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >

          <h3 className="text-lg font-semibold mb-4">
            ⚙ AI Analysis Configuration
          </h3>

          <div className="space-y-2">

            {request.request_type !== "crop" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analysisType.disease}
                  onChange={() => handleAnalysisChange("disease")}
                />
                Disease Detection
              </label>
            )}

            {request.request_type !== "crop" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analysisType.pest}
                  onChange={() => handleAnalysisChange("pest")}
                />
                Pest Analysis
              </label>
            )}

            {request.request_type !== "prediction" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analysisType.crop}
                  onChange={() => handleAnalysisChange("crop")}
                />
                Crop Recommendation
              </label>
            )}

          </div>

          {/* SOIL PARAMETERS */}

          {analysisType.crop && (

            <div className="mt-6">

              <h4 className="font-semibold mb-3">
                Soil Parameters Override
              </h4>

              <button
                type="button"
                onClick={handleAutoExtract}
                className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Auto Extract From Soil Report
              </button>

              <div className="grid md:grid-cols-3 gap-4">

                {Object.keys(soilOverride).map((key) => (

                  <div key={key}>

                    <label className="text-sm text-gray-600 uppercase">
                      {key}
                    </label>

                    <input
                      type="number"
                      name={key}
                      value={soilOverride[key]}
                      onChange={handleSoilChange}
                      className="w-full border rounded px-3 py-2 mt-1"
                    />

                  </div>

                ))}

              </div>

            </div>

          )}

          <div className="flex justify-end mt-6">

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Process with AI"}
            </button>

          </div>

        </form>

      </div>

      {/* IMAGE PREVIEW MODAL */}

      {previewImage && (

        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >

          <div
            className="bg-white p-4 rounded-lg max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="float-right text-xl"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="preview"
              className="max-h-[80vh]"
            />

          </div>

        </div>

      )}

      {/* PDF PREVIEW MODAL */}

      {previewPdf && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="w-11/12 h-5/6 bg-white rounded-lg overflow-hidden">

            <button
              onClick={() => setPreviewPdf(null)}
              className="absolute top-4 right-6 text-xl"
            >
              ✕
            </button>

            <iframe
              src={previewPdf}
              title="soil-report"
              className="w-full h-full"
            />

          </div>

        </div>

      )}

    </div>
  );
};

export default AIProcessingPage;