import { SiPython, SiJavascript } from "react-icons/si";
import { TbWorldWww } from "react-icons/tb";


function AvailableProj() {
  const data = {
    userId: "69fb2f139d4c42368a74c7d9",
    projects: [
      { _id: "69fb2f5c9d4c42368a74c7da", userId: "69fb2f139d4c42368a74c7d9", name: "Neural Task Manager",      type: "js", __v: 0, id: "69fb2f5c9d4c42368a74c7da" },
      { _id: "70ac3g6d0e5f53479b85d8eb", userId: "69fb2f139d4c42368a74c7d9", name: "NexusFlow Engine",         type: "python", __v: 0, id: "70ac3g6d0e5f53479b85d8eb" },
      { _id: "81bd4h7e1f6g64580c96e9fc", userId: "69fb2f139d4c42368a74c7d9", name: "Async Socket Handler",     type: "HTML", __v: 0, id: "81bd4h7e1f6g64580c96e9fc" },
      { _id: "92ce5i8f2g7h75691d07f0gd", userId: "69fb2f139d4c42368a74c7d9", name: "Dynamic Auth Middleware",  type: "HTML", __v: 0, id: "92ce5i8f2g7h75691d07f0gd" },
      { _id: "a3df6j9g3h8i86702e18g1he", userId: "69fb2f139d4c42368a74c7d9", name: "Pixel Canvas Renderer",   type: "js", __v: 0, id: "a3df6j9g3h8i86702e18g1he" },
    ],
  };

  const projectDetails = data.projects.map((project) => ({
    name: project.name,
    type: project.type,
  }));

  const cards = [
    { id: "python",     icon: <SiPython />, label: "Python",   iconColor: "text-blue-400",  desc: "ML, scripting, automation", accent: "text-blue-400",   border: "hover:border-blue-500/40"   },
    { id: "web",        icon: <TbWorldWww />, label: "Web",     iconColor: "text-cyan-400",    desc: "HTML, CSS, full-stack",     accent: "text-cyan-400",   border: "hover:border-cyan-500/40"   },
    { id: "javascript", icon: <SiJavascript />, label: "JavaScript",iconColor: "text-yellow-400", desc: "Node, React, TypeScript",   accent: "text-yellow-400", border: "hover:border-yellow-500/40" },
  ];

  return (
    <div className="pl-5 w-screen pt-5 bg-zinc-950 grid grid-cols-[1fr_2fr] gap-4">
      {/* Left / New Projects */}
      <div className="flex flex-col gap-4 pr-2 pb-5">
        <span className="font-semibold text-slate-300">
          Get started with new Projects
        </span>
        <div className="grid grid-rows-3 gap-3">
          {cards.map(({ id, icon, label, desc, accent, border, iconColor }) => (
            <button
              key={id}
              className={`flex flex-row items-center gap-3.5 px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 ${border} text-left cursor-pointer transition-all hover:-translate-y-0.5 group`}
            >
              <div className={`p-2 rounded-lg bg-zinc-800 w-fit text-xl flex-shrink-0 ${iconColor}`}>
                {icon}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-slate-200 text-sm font-semibold">{label}</span>
                <span className="text-zinc-500 text-xs ">{desc}</span>
              </div>
              <span className={`text-xs font-medium font-mono flex-shrink-0 ${accent} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`}>
                + New workspace →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right / Recent Projects */}
      <div className="flex flex-col gap-3 pr-5 pb-5">
        <span className="font-semibold text-slate-300">Recent Projects</span>
        <div className="flex flex-col gap-0.5">
          {projectDetails.map((project, i) => {
            const dotColor = {
              python: "bg-blue-400",
              web:    "bg-cyan-400",
              js:     "bg-yellow-400",  // fixed: was "javascript"
            }[project.type] ?? "bg-zinc-600";

            const typeLabel = {
              python: "python",
              web:    "web",
              js:     "js",             // fixed: was "javascript"
            }[project.type] ?? project.type;

            return (
              <div
                key={i}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent hover:bg-zinc-900 hover:border-zinc-800 cursor-pointer transition-all group"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                <span className="text-[12.5px] font-medium text-zinc-400 group-hover:text-slate-200 flex-1 truncate transition-colors">
                  {project.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-700 group-hover:text-zinc-500 flex-shrink-0 transition-colors">
                  {typeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AvailableProj;