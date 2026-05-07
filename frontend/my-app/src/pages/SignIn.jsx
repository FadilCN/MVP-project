import TopBar from "../ui/elements/components/Dashboard/TopBar"

function SignIn() {
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
              placeholder="you@example.com"
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <button className="w-full mt-5 bg-zinc-700 text-slate-200 font-medium text-sm rounded-lg py-2.5 hover:bg-zinc-600 transition-colors">
          Sign in
        </button>

        <p className="text-xs text-center text-zinc-500 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-zinc-300 font-medium hover:text-white transition-colors">Sign up</a>
        </p>

      </div>
    </div>
      
    </div>
  )
}

export default SignIn