import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitRequest } from "../../api/requestService.js";

const SoilTestPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    farm_area: "",
    current_crop: "",
    planned_crop: "",
    visit_time: "",
    contact: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const selectCrop = (type, crop) => {
    setFormData({
      ...formData,
      [type]: crop
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.address.trim() || !formData.contact.trim()) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();

    const description = `
Farm Address: ${formData.address}
Farm Area: ${formData.farm_area} acres
Current Crop: ${formData.current_crop}
Planned Crop: ${formData.planned_crop}
Preferred Visit Time: ${formData.visit_time}
Contact Number: ${formData.contact}
Additional Notes: ${formData.notes}
`;

    formDataToSend.append("description", description);
    formDataToSend.append("request_type", "soil_test");

    try {

      await submitRequest(formDataToSend);

      setSuccess(
        "Soil test request submitted successfully! Agricultural officer will contact you soon."
      );

      setFormData({
        address: "",
        farm_area: "",
        current_crop: "",
        planned_crop: "",
        visit_time: "",
        contact: "",
        notes: ""
      });

      setTimeout(() => {
        navigate("/farmer/my-requests");
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.error || "Failed to submit request");
    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Book Soil Test
          </h1>

          <p className="text-gray-600 mt-1">
            Schedule on-site soil testing with agricultural officers
          </p>

        </div>

        {/* PROCESS STEPS */}

        <div className="bg-white shadow rounded-lg p-4 mb-6">

          <div className="flex justify-between text-center text-sm text-gray-600">

            <div className="flex-1">
              <div className="text-xl">📝</div>
              Book Request
            </div>

            <div className="flex-1">
              <div className="text-xl">👨‍🌾</div>
              Officer Visit
            </div>

            <div className="flex-1">
              <div className="text-xl">📄</div>
              Soil Report
            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >

          {/* ALERTS */}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded">
              {success}
            </div>
          )}

          {/* FARM DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Farm Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Village / farm location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Farm Area (acres)
              </label>
              <input
                type="number"
                name="farm_area"
                value={formData.farm_area}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Example: 2"
              />
            </div>

          </div>

          {/* CURRENT CROP */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Crop
            </label>

            <div className="flex flex-wrap gap-2 mb-2">

              {["Rice","Banana","Coconut","Pepper","None"].map((crop)=>(
                <button
                  key={crop}
                  type="button"
                  onClick={()=>selectCrop("current_crop",crop)}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {crop}
                </button>
              ))}

            </div>

            <input
              type="text"
              name="current_crop"
              value={formData.current_crop}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Example: Rice"
            />

          </div>

          {/* PLANNED CROP */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Crop
            </label>

            <div className="flex flex-wrap gap-2 mb-2">

              {["Rice","Banana","Coconut","Vegetables","Others"].map((crop)=>(
                <button
                  key={crop}
                  type="button"
                  onClick={()=>selectCrop("planned_crop",crop)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {crop}
                </button>
              ))}

            </div>

            <input
              type="text"
              name="planned_crop"
              value={formData.planned_crop}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Example: Coconut"
            />

          </div>

          {/* VISIT TIME */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-700">
                Preferred Visit Time
              </label>

              <select
                name="visit_time"
                value={formData.visit_time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >

                <option value="">Select</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="anytime">Anytime</option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700">
                Contact Number *
              </label>

              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Phone number"
              />

            </div>

          </div>

          {/* NOTES */}

          <div>

            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Any soil issues, irrigation problems, etc."
            />

          </div>

          {/* EXPECTATION */}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              What to expect
            </h4>

            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Officer will contact you within 24–48 hours</li>
              <li>• Soil sample will be collected from your farm</li>
              <li>• Lab testing will be performed</li>
              <li>• Detailed soil health report will be provided</li>
            </ul>

          </div>

          {/* SOIL TEST DETAILS */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Soil testing includes
            </h4>

            <ul className="text-sm text-blue-700 space-y-1">
              <li>• pH level analysis</li>
              <li>• Nitrogen, Phosphorus, Potassium levels</li>
              <li>• Soil fertility analysis</li>
              <li>• Organic matter content</li>
              <li>• Crop suitability recommendations</li>
            </ul>

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={()=>navigate("/farmer/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Book Soil Test"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default SoilTestPage;