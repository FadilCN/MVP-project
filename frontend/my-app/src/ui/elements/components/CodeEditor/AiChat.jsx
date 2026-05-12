import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";

function AIChat({ loadFiles, filess }) {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Reference to keep the chat scrolled to the bottom
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  // Load existing chat history from the backend
  const loadChat = async () => {
    try {
      const projectId = localStorage.getItem("projectId");
      const token = Cookies.get("token");
      if (!projectId) return;

      const res = await axios.get(`http://localhost:3000/chats/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChatHistory(res.data?.history || []);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  // Save a message to the database
  const saveChatToDb = async (from, message) => {
    try {
      const projectId = localStorage.getItem("projectId");
      const token = Cookies.get("token");
      if (!projectId) return;

      await axios.put(
        `http://localhost:3000/chats/${projectId}`,
        { message: from + message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  };

  function filterFiles(files) {
  const ignoreFile = files.find(f => f.fileName === '.fileignore');

  if (!ignoreFile) return files;

  const ignoredNames = ignoreFile.content.split('\n').map(name => name.trim());

  return files.filter(file => {
    if (file.fileName === '.fileignore') return false;
    return !ignoredNames.includes(file.fileName);
  });
}
  // Handle Streaming Response
  const getStreamedResponse = async (message) => {
    const token = Cookies.get("token");
    const projectId = localStorage.getItem("projectId");
    const lang= localStorage.getItem("lang");

    const ignoredFiles = filterFiles(filess);

    console.log(ignoredFiles);

    const res = await fetch("http://localhost:3000/llm/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, files: ignoredFiles, projectId, prompt: message, lang:lang }),
    });

    if (!res.body) return "";

    const decoder = new TextDecoder();
    let fullText = "";

    // Push an initial empty AI message to the history
    setChatHistory((prev) => [...prev, "AI: "]);

    const reader = res.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      fullText += decodedChunk;

      // Update the last message (the AI's message) in real-time
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = "AI: " + fullText;
        return updated;
      });
    }

    return fullText;
  };

  

  const handleSend = async () => {
    if (!value.trim() || loading) return;

    const userMessage = value;
    setValue("");
    setLoading(true);

    // 1. Add User message and save to DB
    setChatHistory((prev) => [...prev, "YOU: " + userMessage]);
    await saveChatToDb("YOU: ", userMessage);

    try {
      // 2. Stream AI response
      const fullAiResponse = await getStreamedResponse(userMessage);

      // 3. Save final AI response
      if (fullAiResponse) {
        await saveChatToDb("AI: ", fullAiResponse);
      }
      
      loadFiles(); 
    } catch (err) {
      console.error("LLM Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChat();
  }, []);

  return (
    <div className="grid grid-rows-[8%_84%_8%] h-screen bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-zinc-800 font-bold text-slate-500 text-sm">
        AI Assistant
      </div>

      {/* Chat area */}
      <div className="flex flex-col gap-3 overflow-y-auto bg-zinc-900 p-4">
        {chatHistory.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
            No messages yet.
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-md text-xs leading-relaxed max-w-[90%] ${
                msg.startsWith("AI")
                  ? "bg-zinc-800 text-zinc-100 self-start"
                  : "bg-blue-900/40 text-blue-100 self-end"
              }`}
            >
              {msg.replace(/^(AI: |YOU: )/, "")}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
  <div className="self-start px-3 py-2 rounded-md bg-zinc-800 text-zinc-400 text-xs animate-pulse">
    AI is responding...
  </div>
)}
    

        {/* Anchor for Auto-scroll */}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center bg-zinc-950 px-4 gap-2 border-t border-zinc-800">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 px-4 py-2 bg-zinc-800 rounded-md text-xs outline-none text-white border border-zinc-700 focus:border-blue-500 transition-all disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="h-8 w-10 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-zinc-700"
        >
          <IoSend className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default AIChat;