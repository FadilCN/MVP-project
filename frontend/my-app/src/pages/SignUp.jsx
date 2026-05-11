import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopBar from "../ui/elements/components/Dashboard/TopBar";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/users/signup", {
        email: formData.email,
        password: formData.password,
      });

      navigate("/signin");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="bg-zinc-950 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-slate-200 mb-1">
            Create account
          </h1>
          <p className="text-sm text-zinc-500 mb-6">Get started for free</p>

          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-5 bg-zinc-700 text-slate-200 font-medium text-sm rounded-lg py-2.5 hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-xs text-center text-zinc-500 mt-4">
            Already have an account?{" "}
            <a
              href="#"
              className="text-zinc-300 font-medium hover:text-white transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
