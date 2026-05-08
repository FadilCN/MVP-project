import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TopBar from "../ui/elements/components/Dashboard/TopBar";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

    const navigate = useNavigate()

 const handleSubmit = async () => {
  setLoading(true);

   try {
      const res = await axios.post(
        "http://localhost:3000/users/login",
        formData
      );

      // save token in cookie
      Cookies.set("token", res.data.token, {
        expires: 7,
        sameSite: "strict",
      });

      Cookies.set("userId", res.data.userId, {
        expires: 7,
        sameSite: "strict",
      });

      console.log(res.data.token );
      console.log("Token saved cookies");
      console.log(Cookies.get("token"));
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="bg-zinc-950 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-slate-200 mb-1">Sign in</h1>
          <p className="text-sm text-zinc-500 mb-6">Welcome back</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Email</label>
              <input
                type="email"
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Password</label>
              <input
                type="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-5 bg-zinc-700 text-slate-200 font-medium text-sm rounded-lg py-2.5 hover:bg-zinc-600 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-center text-zinc-500 mt-4">
            Don't have an account?{" "}
            <a href="#" className="text-zinc-300 font-medium hover:text-white">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;