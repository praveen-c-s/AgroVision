import React from "react";

const AIReport = ({
  prediction,
  aiAdvisory,
  finalAdvisoryEN,
  finalAdvisoryML,
  officerNotes
}) => {

  const disease = prediction?.disease;
  const pest = prediction?.pest;

  const diseaseAdvice = aiAdvisory?.disease;
  const pestAdvice =
    aiAdvisory?.pest?.advisory
      ? Object.values(aiAdvisory.pest.advisory)[0]
      : null;
  const [language, setLanguage] = React.useState("en");

  const cropRecommendations =
    prediction?.crop_recommendation?.top_recommendations || [];

  const bestCrop = cropRecommendations[0];

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 90) return "bg-green-100 text-green-800 border-green-300";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getSeverityBadge = (severity) => {
    if (severity === "Low") return "bg-green-200 text-green-800";
    if (severity === "Medium") return "bg-yellow-200 text-yellow-800";
    return "bg-red-200 text-red-800";
  };

  const getSoilStatusColor = (status) => {
    if (status === "Low") return "text-red-600 font-semibold";
    if (status === "Medium") return "text-yellow-600 font-semibold";
    if (status === "Good") return "text-green-600 font-semibold";
    if (status === "Ideal") return "text-green-700 font-semibold";
    return "text-gray-600";
  };

  /* ================= VOICE FUNCTION ================= */

  const speakAdvisory = () => {

    let message = "";

    if (language === "en") {
      message = finalAdvisoryEN || "No advisory available";
    } else {
      message = finalAdvisoryML || "ഉപദേശം ലഭ്യമല്ല";
    }

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = language === "ml" ? "ml-IN" : "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(speech);
  };



  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-green-700">
          🌿 AgroVision Agricultural Report
        </h2>

        <div className="flex gap-2">

          <button
            onClick={speakAdvisory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🔊 Listen
          </button>

          <button
            onClick={stopSpeech}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Stop
          </button>

        </div>

      </div>

      {/* SUMMARY CARDS */}

      {(disease || pest || bestCrop) && (
        <div className="grid md:grid-cols-3 gap-4">

          {disease && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <p className="text-sm text-gray-500">Detected Disease</p>
              <p className="text-lg font-bold text-green-800">
                {disease.disease_name}
              </p>
              <p className="text-sm">Confidence: {disease.confidence}%</p>
            </div>
          )}

          {pest?.top_predictions?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-gray-500">Detected Pest</p>
              <p className="text-lg font-bold text-yellow-800">
                {pest.top_predictions[0].label}
              </p>
              <p className="text-sm">
                Confidence: {pest.top_predictions[0].confidence}%
              </p>
            </div>
          )}

          {bestCrop && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <p className="text-sm text-gray-500">Best Crop</p>
              <p className="text-lg font-bold text-green-800">
                {bestCrop.crop}
              </p>
              <p className="text-sm">
                Suitability: {bestCrop.confidence}%
              </p>
            </div>
          )}

        </div>
      )}

      {/* ================= DISEASE DETECTION ================= */}

      {disease && (

        <div className="bg-green-50 border border-green-200 rounded-lg p-5 space-y-4">

          <h3 className="text-lg font-semibold text-green-800">
            🦠 Disease Detection
          </h3>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs text-gray-500">Crop</p>
              <p className="font-semibold">{disease.crop}</p>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs text-gray-500">Disease</p>
              <p className="font-semibold">{disease.disease_name}</p>
            </div>

            <div className="bg-white border rounded-lg p-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Confidence</span>
              <span
                className={`px-2 py-1 text-xs rounded-full border ${getConfidenceBadge(
                  disease.confidence
                )}`}
              >
                {disease.confidence}%
              </span>
            </div>

          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${getSeverityBadge(
              disease.severity
            )}`}
          >
            Severity: {disease.severity}
          </span>

          {diseaseAdvice && (

            <div className="grid md:grid-cols-2 gap-4 mt-4">

              {diseaseAdvice.description && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Description</p>
                  <p>{diseaseAdvice.description}</p>
                </div>
              )}

              {diseaseAdvice.symptoms && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Symptoms</p>
                  <p>{diseaseAdvice.symptoms}</p>
                </div>
              )}

              {diseaseAdvice.treatment && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Treatment</p>
                  <p>{diseaseAdvice.treatment}</p>
                </div>
              )}

              {diseaseAdvice.pesticide_name && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Pesticide</p>
                  <p>{diseaseAdvice.pesticide_name}</p>
                </div>
              )}

              {diseaseAdvice.dosage && diseaseAdvice.dosage !== "N/A" && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Dosage</p>
                  <p>{diseaseAdvice.dosage}</p>
                </div>
              )}

              {diseaseAdvice.frequency && diseaseAdvice.frequency !== "N/A" && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Spray Frequency</p>
                  <p>{diseaseAdvice.frequency}</p>
                </div>
              )}

              {diseaseAdvice.prevention && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Prevention</p>
                  <p>{diseaseAdvice.prevention}</p>
                </div>
              )}

              {diseaseAdvice.safety_precautions && (
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Safety</p>
                  <p>{diseaseAdvice.safety_precautions}</p>
                </div>
              )}

            </div>

          )}

        </div>

      )}

      {/* ================= PEST DETECTION ================= */}

      {pest && (

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 space-y-4">

          <h3 className="text-lg font-semibold text-yellow-800">
            🐛 Pest Detection
          </h3>

          {pest.top_predictions?.length > 0 && (

            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-white border rounded-lg p-3">
                <p className="text-xs text-gray-500">Detected Pest</p>
                <p className="font-semibold">
                  {pest.top_predictions[0].label}
                </p>
              </div>

              <div className="bg-white border rounded-lg p-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Confidence</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full border ${getConfidenceBadge(
                    pest.top_predictions[0].confidence
                  )}`}
                >
                  {pest.top_predictions[0].confidence}%
                </span>
              </div>

            </div>

          )}

          {/* PEST ADVISORY */}

          {pestAdvice && (

            <>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <p>{pestAdvice.risk_level}</p>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Spread Risk</p>
                  <p>{pestAdvice.spread_risk}</p>
                </div>

              </div>

              <div className="bg-white border rounded-lg p-3">

                <p className="text-xs text-gray-500 mb-1">
                  Immediate Action
                </p>

                <ul className="list-disc ml-5">

                  {pestAdvice.immediate_action?.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}

                </ul>

              </div>

              <div className="grid md:grid-cols-3 gap-4">

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Pesticide</p>
                  <p>{pestAdvice.chemical_control?.pesticide}</p>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Dosage</p>
                  <p>{pestAdvice.chemical_control?.dosage}</p>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Spray Interval</p>
                  <p>{pestAdvice.chemical_control?.spray_interval}</p>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Organic Solution</p>
                  <p>{pestAdvice.organic_control?.solution}</p>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Organic Dosage</p>
                  <p>{pestAdvice.organic_control?.dosage}</p>
                </div>

              </div>

            </>

          )}

        </div>

      )}

      {/* ================= SOIL TEST DATA ================= */}

      {prediction?.crop_recommendation?.soil_parameters_used && (

        <div className="bg-gray-50 border rounded-lg p-6">

          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🧪 Soil Test Data
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {Object.entries(
              prediction.crop_recommendation.soil_parameters_used
            ).map(([key, value]) => (

              <div
                key={key}
                className="bg-white border rounded-lg p-4 text-center shadow-sm"
              >
                <p className="text-xs text-gray-500 uppercase">
                  {key}
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {value}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* ================= SOIL HEALTH ================= */}

      {prediction?.soil_health && (

        <div className="bg-blue-50 border rounded-lg p-6">

          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            🌍 Soil Health Card
          </h3>

          {Object.entries(prediction.soil_health).map(([key, data]) => (

            <div
              key={key}
              className="flex justify-between border p-3 rounded mb-2 bg-white"
            >

              <span>{key}</span>

              <span className={getSoilStatusColor(data.status)}>
                {data.value} ({data.status})
              </span>

            </div>

          ))}

        </div>

      )}

      {/* ================= FERTILIZER ================= */}

      {prediction?.fertilizer_recommendation && (

        <div className="bg-yellow-50 border rounded-lg p-6">

          <h3 className="text-lg font-semibold text-yellow-700 mb-3">
            🌾 Fertilizer Recommendation
          </h3>

          {prediction.fertilizer_recommendation.map((item, index) => (

            <p key={index}>✔ {item}</p>

          ))}

        </div>

      )}
      {/* ================= AI EXPLANATION ================= */}

      {prediction?.crop_recommendation?.explanation && (

        <div className="bg-green-50 border rounded-lg p-6">

          <h3 className="text-lg font-semibold text-green-700 mb-3">
            🧠 AI Explanation
          </h3>

          <p className="text-gray-700">
            {prediction.crop_recommendation.explanation}
          </p>

        </div>

      )}

      {/* ================= CROP RECOMMENDATION (UNCHANGED) ================= */}

      {cropRecommendations.length > 0 && (

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">

          <h3 className="text-lg font-semibold text-green-700 mb-3">
            🌱 Crop Recommendation
          </h3>

          {bestCrop && (

            <div className="bg-green-100 border border-green-300 p-4 rounded mb-4">

              <h4 className="font-semibold text-green-800">
                ⭐ Best Crop: {bestCrop.crop}
              </h4>

              <p className="text-sm text-green-700">
                Suitability Score: {bestCrop.confidence}%
              </p>

            </div>

          )}

          <div className="space-y-2">

            {cropRecommendations.map((crop, index) => (

              <div key={index} className="space-y-1">

                <div className="flex justify-between text-sm font-medium">
                  <span>{index + 1}. {crop.crop}</span>
                  <span>{crop.confidence}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${crop.confidence}%` }}
                  ></div>
                </div>

              </div>

            ))}

          </div>

        </div>

      )}
      {/* ================= FINAL ADVISORY ================= */}

      {(finalAdvisoryEN || finalAdvisoryML) && (

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold text-blue-700">
              📢 Final Officer Advisory
            </h3>

            {/* LANGUAGE SWITCH */}

            <div className="flex gap-2">

              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded ${language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
                  }`}
              >
                English
              </button>

              <button
                onClick={() => setLanguage("ml")}
                className={`px-3 py-1 rounded ${language === "ml"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
                  }`}
              >
                മലയാളം
              </button>

            </div>

          </div>

          <div className="bg-white border rounded p-4 whitespace-pre-line">

            {language === "en"
              ? finalAdvisoryEN
              : finalAdvisoryML}

          </div>

        </div>

      )}

      {/* ================= OFFICER NOTES ================= */}

      {officerNotes && (

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">

          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            📝 Officer Notes
          </h3>

          <p className="whitespace-pre-line">
            {officerNotes}
          </p>

        </div>

      )}

    </div>
  );
};

export default AIReport;