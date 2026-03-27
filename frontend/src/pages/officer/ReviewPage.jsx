import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, reviewRequest } from "../../api/requestService.js";
import AIReport from "../../components/AIReport";

const ReviewPage = () => {

  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [reviewData, setReviewData] = useState({
    final_advisory_en: "",
    final_advisory_ml: "",
    officer_notes: ""
  });

  /* ================= FETCH REQUEST ================= */

  const fetchRequest = useCallback(async () => {

    try {

      setPageLoading(true);
      setError("");

      const data = await getRequest(requestId);
      setRequest(data);

      setReviewData({
        final_advisory_en: "",
        final_advisory_ml: "",
        officer_notes: ""
      });

    } catch (err) {

      console.error(err);
      setError("Failed to fetch request details");

    } finally {

      setPageLoading(false);

    }

  }, [requestId]);

  useEffect(() => {
    if (requestId) fetchRequest();
  }, [fetchRequest, requestId]);

  /* ================= HANDLE CHANGE ================= */

  const handleAdvisoryChange = (e) => {

    const value = e.target.value;

    if (selectedLanguage === "en") {

      setReviewData(prev => ({
        ...prev,
        final_advisory_en: value
      }));

    } else {

      setReviewData(prev => ({
        ...prev,
        final_advisory_ml: value
      }));

    }

  };

  const handleNotesChange = (e) => {

    const value = e.target.value;

    setReviewData(prev => ({
      ...prev,
      officer_notes: value
    }));

  };

  /* ================= TRANSLATE ================= */

  const translateToMalayalam = async (text) => {

  const maxLength = 450;
  const parts = [];

  for (let i = 0; i < text.length; i += maxLength) {
    parts.push(text.substring(i, i + maxLength));
  }

  let translatedText = "";

  for (const part of parts) {

    try {

      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}&langpair=en|ml`
      );

      const data = await res.json();

      translatedText += data.responseData.translatedText + " ";

    } catch {

      translatedText += part;

    }

  }

  return translatedText;

};

  /* ================= GENERATE AI ADVISORY ================= */

  const generateAdvisoryFromAI = async () => {

    let text = "";

    if (request?.prediction?.disease && request?.ai_advisory?.disease) {

      const disease = request.prediction.disease;
      const advice = request.ai_advisory.disease;

      text += `
🌿 DISEASE ADVISORY

Detected Disease: ${disease.disease_name}
Crop: ${disease.crop}
Confidence: ${disease.confidence}%

Symptoms:
${advice.symptoms}

Treatment:
${advice.treatment}

Pesticide:
${advice.pesticide_name}

Dosage:
${advice.dosage}

Spray Frequency:
${advice.frequency}

Prevention:
${advice.prevention}

Safety:
${advice.safety_precautions}

`;

    }

    if (request?.prediction?.pest && request?.ai_advisory?.pest) {

      const pest = request.prediction.pest.top_predictions?.[0];
      const advisory = Object.values(request.ai_advisory.pest.advisory || {})[0];

      if (pest && advisory) {

        text += `
🐛 PEST ADVISORY

Detected Pest: ${pest.label}
Confidence: ${pest.confidence}%

Risk Level:
${advisory.risk_level}

Immediate Action:
${advisory.immediate_action?.join("\n")}

Pesticide:
${advisory.chemical_control?.pesticide}

Dosage:
${advisory.chemical_control?.dosage}

Spray Interval:
${advisory.chemical_control?.spray_interval}

`;

      }

    }

    if (request?.prediction?.crop_recommendation?.top_recommendations) {

  const crops = request.prediction.crop_recommendation.top_recommendations;
  const best = crops[0];

  text += `
🌱 PLANT RECOMMENDATION FOR YOUR FARM

Based on the soil test and environmental conditions, the most suitable crop for your land is:

Recommended Crop: ${best.crop.toUpperCase()}

Suitability Score: ${best.confidence}%

Why this crop is suitable:
${request?.prediction?.crop_recommendation?.explanation || "This crop matches your soil nutrient levels and climate conditions."}

Other crops that can also grow well in your soil:

`;

  crops.slice(1).forEach((crop, index) => {

    text += `${index + 1}. ${crop.crop} (Suitability: ${crop.confidence}%)\n`;

  });

  text += `

Farmer Guidance:
• Prepare the soil properly before planting.
• Maintain proper irrigation based on crop needs.
• Apply recommended fertilizers according to soil condition.
• Monitor for pests and diseases regularly.

`;
}

    const malayalam = await translateToMalayalam(text);

    setReviewData({
      final_advisory_en: text,
      final_advisory_ml: malayalam,
      officer_notes: ""
    });

  };

  /* ================= SUBMIT REVIEW ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await reviewRequest(requestId, {
        final_advisory_en: reviewData.final_advisory_en,
        final_advisory_ml: reviewData.final_advisory_ml,
        officer_notes: reviewData.officer_notes
      });

      setSuccess("Review submitted successfully!");

      setTimeout(() => {
        navigate(`/officer/complete/${requestId}`);
      }, 1500);

    } catch (err) {

      setError("Failed to submit review");

    } finally {

      setLoading(false);

    }

  };

  /* ================= LOADING ================= */

  if (pageLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading request...
      </div>
    );

  }

  if (!request) {

    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Request not found
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">

        <h1 className="text-3xl font-bold">
          Review AI Results
        </h1>

        {/* AI REPORT (without officer advisory preview) */}

        <AIReport
          prediction={request.prediction}
          aiAdvisory={request.ai_advisory}
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        {/* REVIEW FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-5"
        >

          <div className="flex justify-between items-center">

            <h3 className="text-lg font-semibold">
              Officer Review
            </h3>

            <button
              type="button"
              onClick={generateAdvisoryFromAI}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate from AI
            </button>

          </div>

          {/* LANGUAGE SELECTOR */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => setSelectedLanguage("en")}
              className={`px-4 py-1 rounded ${
                selectedLanguage === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setSelectedLanguage("ml")}
              className={`px-4 py-1 rounded ${
                selectedLanguage === "ml"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              മലയാളം
            </button>

          </div>

          {/* SINGLE TEXTAREA */}

          <textarea
            rows={10}
            value={
              selectedLanguage === "en"
                ? reviewData.final_advisory_en
                : reviewData.final_advisory_ml
            }
            onChange={handleAdvisoryChange}
            className="w-full border rounded p-3"
            placeholder="Edit advisory..."
          />

          {/* OFFICER NOTES */}

          <div>

            <label className="block font-medium mb-2">
              Officer Notes
            </label>

            <textarea
              rows={4}
              value={reviewData.officer_notes}
              onChange={handleNotesChange}
              className="w-full border rounded p-3"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/officer/assigned")}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default ReviewPage;