import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FaRegFileCode } from "react-icons/fa6";
import Cookies from "js-cookie";
import axios from "axios";

function CodeViewer(props) {
  const [code, setCode] = useState(props.content || "");
  const [output, setOutput] = useState(""); // State to store the execution output
  const codeRef = useRef(props.content || "");

  useEffect(() => {
    setCode(props.content || "");
    codeRef.current = props.content || "";
  }, [props.content]);

  console.log("files:", props.files);

  const handleSave = async (id) => {
    if (!id) return;
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:3000/files/${id}`,
        { content: codeRef.current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      props.loadFiles();
      props.setCode(codeRef.current);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleRun = async () => {
    try {
      const fileName = localStorage.getItem("fileName");
      const res = await axios.post("http://localhost:3000/code/run", {
        files: props.files,
        runFileName: fileName,
      });

      // Update the output state with the result
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || "An error occurred while running the code.");
      console.error("Run error:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const fileId = localStorage.getItem("fileId");
      if (fileId) handleSave(fileId);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1f1f27",
      },
    });
    monaco.editor.setTheme("myCustomTheme");
  };

  return (
    // Changed grid to 3 rows: Header (8%), Editor (auto), Output (25%)
    <div className="grid grid-rows-[50px_1fr_180px] h-screen bg-zinc-950 overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-slate-400">
          <FaRegFileCode className="text-sm" />
          <span className="text-xs font-mono">{props.fileName || "untitled"}</span>
        </div>
        
        {/* BUTTONS IN HEADER (Cleaner Layout) */}
        <div className="flex gap-2">
          <button
            className="h-7 px-4 flex items-center bg-zinc-800 text-white rounded text-xs hover:bg-zinc-700 transition"
            onClick={() => handleSave(localStorage.getItem("fileId"))}
          >
            Save
          </button>
          <button
            className="h-7 px-4 flex items-center bg-green-600 text-white rounded text-xs hover:bg-green-500 transition"
            onClick={handleRun}
          >
            Run
          </button>
        </div>
      </div>

      {/* EDITOR SECTION */}
      <div className="relative overflow-hidden bg-[#1f1f27]">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => {
            const val = value || "";
            setCode(val);
            codeRef.current = val;
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 10 }
          }}
        />
      </div>

      {/* OUTPUT SECTION */}
      <div className="flex flex-col bg-black border-t border-zinc-800">
        <div className="px-4 py-1 text-[10px] text-zinc-500 uppercase font-bold tracking-wider border-b border-zinc-900">
          Terminal / Output
        </div>
        <div className="p-4 overflow-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
          {output ? output : <span className="text-zinc-600 italic">No output yet. Click "Run" to execute.</span>}
        </div>
      </div>

    </div>
  );
}

export default CodeViewer;