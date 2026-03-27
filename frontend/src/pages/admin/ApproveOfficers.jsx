import { useEffect, useState } from "react";
import axios from "axios";

const ApproveOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOfficers = async () => {
    const res = await axios.get("/api/admin/pending-officers", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setOfficers(res.data);
  };

  const approveOfficer = async (id) => {
    await axios.put(`/api/admin/approve-officer/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchOfficers();
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Pending Officer Approvals
      </h2>

      <div className="space-y-4">
        {officers.map((o) => (
          <div
            key={o._id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold">{o.name}</p>
              <p className="text-sm text-gray-600">{o.email}</p>
              <p className="text-sm text-gray-500">District: {o.district}</p>
            </div>

            <button
              onClick={() => approveOfficer(o._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveOfficers;