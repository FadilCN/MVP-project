import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FaRegFileCode } from "react-icons/fa6";
import Cookies from "js-cookie";
import axios from "axios";

function CodeViewer(props) {

  const [code, setCode] = useState("");
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const handleSave = async (Id) => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:3000/files/${Id}`,
        { content: codeRef.current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      props.loadFiles();
      props.setCode(codeRef.current);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const fileId = localStorage.getItem("fileId"); 
      handleSave(fileId);
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
    <div className="grid grid-rows-[8%_92%] h-screen bg-zinc-950">
      <div className="flex items-center px-4 text-sm bg-zinc-950 text-slate-500 gap-2">
        <FaRegFileCode className="text-slate-500 text-sm" />
        <span>{props.fileName}</span>
      </div>

      <div className="overflow-hidden bg-[#1f1f27] p-4 mr-1 ml-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={props.content}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
        />
        <button
          className="h-5 w-25 mb-15 flex items-center justify-center bg-slate-600 text-white rounded-sm hover:bg-slate-500 transition"
          onClick={() => handleSave(localStorage.getItem("fileId"))}
        >
          <span className="text-[12px]">Save File</span>
        </button>
      </div>
    </div>
  );
}

export default CodeViewer;