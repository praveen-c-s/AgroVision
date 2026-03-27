import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitRequest } from "../../api/requestService.js";

const SubmitPredictionPage = () => {

  const [formData, setFormData] = useState({
    description: "",
    crop: ""
  });

  const [symptoms, setSymptoms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /* ================= IMAGE SELECT ================= */

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ================= SYMPTOMS ================= */

  const handleSymptomChange = (value) => {

    if (symptoms.includes(value)) {
      setSymptoms(symptoms.filter((s) => s !== value));
    } else {
      setSymptoms([...symptoms, value]);
    }

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("file", selectedFile);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("crop", formData.crop);
    formDataToSend.append("symptoms", JSON.stringify(symptoms));
    formDataToSend.append("request_type", "prediction");

    try {

      await submitRequest(formDataToSend);

      setSuccess(
        "Request submitted successfully. Officer will review your request."
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit Plant Disease Request
        </h1>

        <p className="text-gray-600 mb-6">
          Upload a plant image and describe the symptoms for AI disease detection.
        </p>

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

          {/* ================= IMAGE UPLOAD ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plant Image *
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">

              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
              />

              <label htmlFor="fileUpload" className="cursor-pointer">

                {preview ? (

                  <div className="space-y-3">

                    <img
                      src={preview}
                      alt="preview"
                      className="w-40 h-40 object-cover mx-auto rounded-lg border shadow"
                    />

                    <p className="text-sm text-gray-600">
                      {selectedFile?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Click to change image
                    </p>

                  </div>

                ) : (

                  <div>

                    <div className="text-4xl mb-2">📷</div>

                    <p className="text-gray-600">
                      Click to upload plant image
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      JPG / PNG up to 5MB
                    </p>

                  </div>

                )}

              </label>

            </div>

          </div>

          {/* ================= CROP SELECT ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Name (Optional)
            </label>

            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >

              <option value="">Select crop</option>
              <option value="rice">Rice</option>
              <option value="corn">Corn</option>
              <option value="potato">Wheat</option>
              <option value="tomato">Tomato</option>
              <option value="banana">Apple</option>
              <option value="coconut">Grape</option>
              <option value="unknown">Other</option>

            </select>

          </div>

          {/* ================= SYMPTOMS ================= */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              What symptoms do you see? (Optional)
            </label>

            <div className="grid grid-cols-2 gap-2 text-sm">

              {[
                "Yellow leaves",
                "Brown spots",
                "Holes in leaves",
                "White powder",
                "Insects on plant",
                "Plant wilting"
              ].map((symptom) => (

                <label key={symptom} className="flex items-center space-x-2">

                  <input
                    type="checkbox"
                    onChange={() => handleSymptomChange(symptom)}
                  />

                  <span>{symptom}</span>

                </label>

              ))}

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
              placeholder="Example: Leaves turning yellow, insects on plant, brown spots appearing..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />

          </div>

          {/* ================= IMAGE INSTRUCTIONS ================= */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📸 Tips for Better Detection
            </h4>

            <ul className="text-sm text-blue-700 space-y-1">

              <li>• Take the photo in natural daylight</li>
              <li>• Focus clearly on the affected leaf</li>
              <li>• Keep the camera steady to avoid blurry images</li>
              <li>• Make sure the damaged or infected area is clearly visible</li>
              <li>• If insects are present, capture them clearly on the plant</li>

            </ul>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="flex justify-end space-x-3">

            <button
              type="button"
              onClick={() => navigate("/farmer/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default SubmitPredictionPage;