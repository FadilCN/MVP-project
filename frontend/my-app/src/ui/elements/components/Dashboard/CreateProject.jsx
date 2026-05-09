import { useState } from "react";
import Cookies from "js-cookie"
import axios from "axios";
import { useNavigate } from "react-router-dom";



function CreateProject( { setPopup , type}) {
  const [text, setText] = useState("");

const navigate = useNavigate();

  const handleCreate = async () => {
  try {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    

    const res = await axios.post(
      "http://localhost:3000/projects/create",
      {
        name: text,
        userId: userId,
        type: type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.setItem("projectId", res.data._id);
    localStorage.setItem("projectName", res.data.name);

    const res2 = await axios.post(
      "http://localhost:3000/chats/create",
      {
        projectId: localStorage.getItem("projectId"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    navigate("/editor");
    return res2.data;
  } catch (err) {
    console.error(err);
    return { projects: [] };
  }
};


  const handleCancel = () => {
    setText("");
    setPopup(false);
  };

  return (

    

   

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/10 w-screen h-screen">
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-zinc-950 rounded-2xl p-6 w-full max-w-sm">
        
        {/* heading */}
        <div className="text-slate-200 font-semibold mb-4">
          Create Project
        </div>

        {/* textbox */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Project name"
          className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
        />

        {/* buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCreate}
            className="flex-1 bg-zinc-800 text-slate-200 text-sm rounded-lg py-2.5 hover:bg-zinc-700 transition cursor-pointer"
          >
            Create
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 bg-red-800 text-slate-200 text-sm rounded-lg py-2.5 hover:bg-red-700 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}

export default CreateProject;