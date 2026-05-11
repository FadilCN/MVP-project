import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import FileBrowser from "../ui/elements/components/CodeEditor/FileBrowser";
import CodeViewer from "../ui/elements/components/CodeEditor/CodeViewer";
import AIChat from "../ui/elements/components/CodeEditor/AiChat";


function CodeEditor() {
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [topic, setTopic] = useState("");
  const [code, setCode] = useState("");

  console.log(code);
  
  const loadFiles = async () => {
    try {
      const projectId = localStorage.getItem("projectId");
      const token = Cookies.get("token");

      if (!projectId) return;

      const res = await axios.get(
        `http://localhost:3000/files/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      const fileList = Array.isArray(data) ? data : data?.files || [];

      console.log(fileList);

      setFiles(fileList);
      setTopic(fileList[0]?.fileName || "");
      setFileid(fileList[0]?.id || "");
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    loadFiles();
  }, []);

  
  const fileName = files.map((file) => file.fileName);
  const fileContent = files.map((file) => file.content);
  const fileId = files.map((file) => file._id);

  
  localStorage.setItem("fileId", fileId[selectedIndex]);
  console.log(fileId);

  const projectName = localStorage.getItem("projectName");

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] h-screen w-screen">
      <FileBrowser
        fileName={fileName}
        fileId={fileId}
        loadFiles={loadFiles}
        setSelectedIndex={setSelectedIndex}
        setTopic={setTopic}
        projectName={projectName}
        loadFiles={loadFiles}
      />

      <CodeViewer
        fileName={fileName[selectedIndex]}        
        content={fileContent[selectedIndex]}
        loadFiles={loadFiles}
        setCode={setCode}
      />

      <AIChat
        code = {code}
        loadFiles={loadFiles}
      />
    </div>
  );
}

export default CodeEditor;