import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../api/requestService";
import AIReport from "../../components/AIReport";

const ViewReportPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getRequest(requestId);
        setRequest(data);
      } catch (err) {
        console.error("Failed to fetch request");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!request) return <div className="p-6">Report not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          🌾 Final Advisory Report
        </h1>

        {request.status === "completed" && (
          <AIReport
            prediction={request.prediction}
            aiAdvisory={request.ai_advisory}
            finalAdvisoryEN={request.final_advisory_en}
            finalAdvisoryML={request.final_advisory_ml}
            officerNotes={request.officer_notes}
          />
        )}

      </div>
    </div>
  );
};

export default ViewReportPage;