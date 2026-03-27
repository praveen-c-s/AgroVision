import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [spikes, setSpikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [statsRes, spikesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", { headers }),
          axios.get("http://localhost:5000/api/admin/disease-spike", { headers })
        ]);
        setStats(statsRes.data.data || {});
        setSpikes(spikesRes.data.spikes || []);
      } catch (error) {
        console.error("Dashboard sync error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest">Securing Connection...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-blob"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Command Center</h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">Real-time oversight of the AgroVision ecosystem.</p>
        </div>

        {/* ---------- STATS GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Global Network" value={stats.total_users} label="Total Users" icon="🌐" color="text-slate-900" />
          <StatCard title="Active Officers" value={stats.total_officers} label="Verified Experts" icon="🛡️" color="text-blue-600" />
          <StatCard title="Pending Queue" value={stats.pending_requests} label="Needs Action" icon="⏳" color="text-amber-600" highlight={stats.pending_requests > 0} />
          <StatCard title="Success Rate" value={stats.processed_requests} label="Cases Resolved" icon="✅" color="text-emerald-600" />
        </div>

        {/* ---------- EMERGENCY ALERTS ---------- */}
        <div className="glass-card p-10 border-t-8 border-rose-500 shadow-2xl bg-white/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                Disease Outbreak Alerts
              </h3>
              <p className="text-slate-500 text-sm mt-1">Automatic detection of abnormal infection clusters.</p>
            </div>
            <button className="text-[10px] font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 hover:bg-rose-100 transition-all uppercase tracking-widest">
              Broadcast Alert
            </button>
          </div>

          {spikes.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <span className="text-4xl mb-4 block">✨</span>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">System Clear: No Outbreaks Detected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spikes.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-rose-50 border border-rose-100 rounded-3xl group hover:bg-rose-600 transition-all cursor-default">
                  <div>
                    <p className="text-[10px] font-black text-rose-400 uppercase group-hover:text-rose-200 transition-colors">Critical Cluster</p>
                    <h4 className="text-xl font-bold text-rose-900 group-hover:text-white transition-colors">{s.crop} <span className="opacity-40">/</span> {s.disease}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-rose-600 group-hover:text-white transition-colors">{s.count}</p>
                    <p className="text-[10px] font-black text-rose-400 uppercase group-hover:text-rose-200 transition-colors">Cases</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, label, icon, color, highlight }) => (
  <div className={`glass-card p-8 border border-white transition-all hover:-translate-y-1 ${highlight ? 'border-amber-300 ring-4 ring-amber-50' : ''}`}>
    <div className="text-3xl mb-4">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-4xl font-black mb-1 ${color}`}>{value || 0}</p>
    <p className="text-xs font-bold text-slate-800 opacity-60">{title}</p>
  </div>
);

export default AdminDashboard;