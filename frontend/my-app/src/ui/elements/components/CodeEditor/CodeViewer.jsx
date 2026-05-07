import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaRegFileCode } from "react-icons/fa6";

function CodeViewer(props) {
  const [code, setCode] = useState("// write your code here");

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1f1f27", // custom background (dark slate)
      },
    });

    monaco.editor.setTheme("myCustomTheme");
  };

  return (
    <div className="grid grid-rows-[8%_92%] h-screen  bg-zinc-950">
      {/* Header */}
      <div className="flex items-center px-4 text-sm bg-zinc-950 text-slate-500 gap-2">
        <FaRegFileCode className="text-slate-500 text-sm" />
        <span>{props.fileName}</span>
      </div>

      {/* Editor */}
      <div className="overflow-hidden bg-[#1f1f27] p-4 mr-1 ml-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={props.content}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}

export default CodeViewer;