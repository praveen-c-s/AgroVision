import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      const role = result.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "officer") navigate("/officer/dashboard");
      else navigate("/farmer/dashboard");
    } else {
      setError(result.error || authError || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-soft mb-4">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Agro<span className="text-green-600">Vision</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Smart Agriculture Support System
          </p>
        </div>

        {/* LOGIN CARD - Glassmorphism effect */}
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white rounded-[2.5rem] p-8 md:p-10">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-4 rounded-2xl mb-6 flex items-center gap-3">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* EMAIL */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 flex justify-center items-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to our platform? 
              <Link
                to="/register"
                className="text-green-600 font-bold hover:text-green-700 ml-2"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;