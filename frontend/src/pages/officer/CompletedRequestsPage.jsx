import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompletedRequests } from "../../api/requestService";

const CompletedRequestsPage = () => {

  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompleted();
  }, []);

  const fetchCompleted = async () => {
    try {
      const response = await getCompletedRequests();
      setRequests(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatType = (type) => {
    if (type === "prediction") return "Disease Detection";
    if (type === "crop") return "Crop Recommendation";
    if (type === "soil_test") return "Soil Test";
    return type;
  };

  const getSummary = (req) => {

    if (req.prediction?.disease) {
      return {
        label: req.prediction.disease.disease,
        crop: req.prediction.disease.crop,
        confidence: req.prediction.disease.confidence
      };
    }

    if (req.prediction?.pest?.top_predictions) {
      return {
        label: req.prediction.pest.top_predictions[0].label,
        confidence: req.prediction.pest.top_predictions[0].confidence
      };
    }

    if (req.prediction?.crop_recommendation) {
      return {
        label: req.prediction.crop_recommendation.top_recommendations[0].crop,
        confidence:
          req.prediction.crop_recommendation.top_recommendations[0].confidence
      };
    }

    return null;
  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Completed Requests
        </h2>

        {requests.length === 0 ? (

          <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
            No completed requests yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {requests.map((req) => {

              const summary = getSummary(req);

              return (

                <div
                  key={req._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >

                  {/* TYPE */}

                  <p className="text-sm text-green-600 font-semibold mb-2">
                    {formatType(req.request_type)}
                  </p>

                  {/* FARMER */}

                  <p className="text-sm text-gray-500">
                    Farmer
                  </p>

                  <p className="font-medium text-gray-800 mb-4">
                    {req.farmer_name}
                  </p>

                  {/* AI SUMMARY */}

                  {summary && (
                    <div className="mb-4">

                      <p className="text-sm text-gray-500">
                        AI Result
                      </p>

                      <p className="font-semibold text-gray-800">
                        {summary.label}
                      </p>

                      {summary.crop && (
                        <p className="text-sm text-gray-600">
                          Crop: {summary.crop}
                        </p>
                      )}

                      {summary.confidence && (
                        <p className="text-sm text-gray-600">
                          Confidence: {summary.confidence}%
                        </p>
                      )}

                    </div>
                  )}

                  {/* FOOTER */}

                  <div className="flex justify-between items-center mt-4">

                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>

                    <button
                      onClick={() => navigate(`/officer/complete/${req._id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      View Report
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );
};

export default CompletedRequestsPage;