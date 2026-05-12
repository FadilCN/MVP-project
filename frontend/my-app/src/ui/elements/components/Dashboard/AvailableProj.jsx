import { SiPython, SiJavascript } from "react-icons/si";
import { TbWorldWww } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import CreateProject from "./CreateProject";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getProjects = async () => {
  try {
    const token = Cookies.get("token");
    const res = await axios.get("http://localhost:3000/users/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { projects: [] };
  }
};

const deleteProject = async (projectId) => {
  try {
    const token = Cookies.get("token");
    await axios.delete(`http://localhost:3000/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
};

function AvailableProj() {
  const [projects, setProjects] = useState({ projects: [] });
  const [popup, setPopup] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); // prevent triggering the navigate onClick
    const success = await deleteProject(projectId);
    if (success) loadProjects();
  };

  const projectDetails = projects.projects.map((project) => ({
    id: project._id,
    name: project.name,
    type: project.type,
  }));

  const cards = [
    { id: "python",     icon: <SiPython />,      label: "Python",     iconColor: "text-blue-400",   desc: "ML, scripting, automation", accent: "text-blue-400",   border: "hover:border-blue-500/40",   type: "python" },
    { id: "web",        icon: <TbWorldWww />,     label: "Web",        iconColor: "text-cyan-400",   desc: "HTML, CSS, full-stack",     accent: "text-cyan-400",   border: "hover:border-cyan-500/40",   type: "HTML"   },
    { id: "javascript", icon: <SiJavascript />,   label: "JavaScript", iconColor: "text-yellow-400", desc: "Node, React, TypeScript",   accent: "text-yellow-400", border: "hover:border-yellow-500/40", type: "js"     },
  ];

  return (
    <div className="pl-5 w-screen pt-5 bg-zinc-950 grid grid-cols-[1fr_2fr] gap-4">
      {/* Left / New Projects */}
      <div className="flex flex-col gap-4 pr-2 pb-5">
        <span className="font-semibold text-slate-300">
          Get started with new Projects
        </span>
        <div className="grid grid-rows-3 gap-3">
          {cards.map(({ id, icon, label, desc, accent, border, iconColor, type }) => (
            <button
              key={id}
              className={`flex flex-row items-center gap-3.5 px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 ${border} text-left cursor-pointer transition-all hover:-translate-y-0.5 group`}
              onClick={() => { setPopup(true); setType(type); localStorage.setItem("lang", id); }}
            >
              <div className={`p-2 rounded-lg bg-zinc-800 w-fit text-xl flex-shrink-0 ${iconColor}`}>
                {icon}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-slate-200 text-sm font-semibold">{label}</span>
                <span className="text-zinc-500 text-xs">{desc}</span>
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
        <div className="flex flex-col gap-0.5 overflow-y-auto min-h-0 flex-1">
          {projectDetails.map((project, i) => {
            const dotColor = {
              python: "bg-blue-400",
              HTML:   "bg-cyan-400",
              js:     "bg-yellow-400",
            }[project.type] ?? "bg-zinc-600";

            const typeLabel = {
              python: "python",
              HTML:   "web",
              js:     "js",
            }[project.type] ?? project.type;

            return (
              <div
  key={i}
  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border-b border-zinc-800 hover:bg-zinc-900 hover:border-zinc-800 cursor-pointer transition-all group"
  onClick={() => {
    localStorage.setItem("projectId", project.id);
    localStorage.setItem("projectName", project.name);
    localStorage.setItem("lang", project.type);
    navigate("/editor");
  }}
>
  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
  <span className="text-[12.5px] font-medium text-zinc-400 group-hover:text-slate-200 flex-1 truncate transition-colors">
    {project.name}
  </span>

  {/* Type label — centered with flex */}
  <span className="text-[10px] font-mono text-zinc-500 pr-100 flex-shrink-0 w-10 text-center">
    {typeLabel}
  </span>

  {/* Delete — always visible */}
  <FiTrash2
    className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
    size={13}
    onClick={(e) => handleDelete(e, project.id)}
  />
</div>
            );
          })}
        </div>
      </div>

      {popup && <CreateProject setPopup={setPopup} type={type} setProjects={loadProjects} />}
    </div>
  );
}

export default AvailableProj;