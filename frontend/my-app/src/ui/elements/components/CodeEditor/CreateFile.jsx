import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function CreateFile({ setPopup, loadFiles, setSelectedIndex }) {
  const [text, setText] = useState("");

  const handleCreate = async () => {
    try {
      const token = Cookies.get("token");
      const projectId = localStorage.getItem("projectId");

      await axios.post(
        `http://localhost:3000/files/create`,
        {
          fileName: text,
          projectId: projectId,
          content: " ",
          path: " ",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

  
      if (loadFiles) {
        const updatedFiles = await loadFiles();
        // loadFiles sets state internally, so we just move selection to end
        if (setSelectedIndex && updatedFiles?.length) {
          setSelectedIndex(updatedFiles.length - 1);
        }
      }

      setText("");
      setPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setText("");
    setPopup(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 w-screen h-screen">
      <div className="bg-zinc-950 rounded-2xl p-6 w-full max-w-sm shadow-xl">

        <div className="text-slate-200 font-semibold mb-4 text-lg">
          Create File
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="File name"
          className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none border border-zinc-700 focus:border-zinc-500"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCreate}
            className="flex-1 bg-zinc-800 text-slate-200 text-sm rounded-lg py-2.5 hover:bg-zinc-700 active:scale-[0.98] transition cursor-pointer"
          >
            Create
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 bg-red-800 text-slate-200 text-sm rounded-lg py-2.5 hover:bg-red-700 active:scale-[0.98] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFile;