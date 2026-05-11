import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";


function AIChat({ code, loadFiles }) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadChat = async () => {
    try {
      const projectId = localStorage.getItem("projectId");
      const token = Cookies.get("token");

      if (!projectId) return;

      const res = await axios.get(
        `http://localhost:3000/chats/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;
      const history = data?.history || [];

      setFiles(history);
      setChatHistory(history);

      console.log("raw chat history:", history);
    } catch (err) {
      console.error(err);
    }
  };

  const sendChat = async (from, message) => {
    try {
      const projectId = localStorage.getItem("projectId");
      const token = Cookies.get("token");

      if (!projectId) return;

      await axios.put(
        `http://localhost:3000/chats/${projectId}`,
        {
          message: from + message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadChat();
    } catch (err) {
      console.error(err);
    }
  };

  const sendllm = async (fileId, message) => {
    const token = Cookies.get("token");
    console.log("frontend token: ", token);

    const res = await fetch("http://localhost:3000/llm/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, fileId, token }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    setChatHistory((prev) => [...prev, "AI: "]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      full += chunk;

      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = "AI: " + full;
        return updated;
      });
    }

    return full;
  };

  useEffect(() => {
    loadChat();
  }, []);

  const aiResponse = async (userMessage) => {
    try {
      setLoading(true);

      const safeCode = typeof code === "string" ? code : "";

      console.log("codeee:", safeCode);

      const fileId = localStorage.getItem("fileId");

      const content = await sendllm(fileId, userMessage + safeCode);

      console.log("AI Response:", content);

      if (content) {
        await sendChat("AI: ", content);
      }

      loadFiles();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!value.trim()) return;

    const userMessage = value;

    setChatHistory((prev) => [...prev, "YOU: " + userMessage]);

    setValue("");

    await sendChat("YOU: ", userMessage);

    aiResponse(userMessage);
  };

  return (
    <div className="grid grid-rows-[8%_84%_8%] h-screen">

      {/* Header */}
      <div className="flex items-center justify-center bg-zinc-950 font-bold text-slate-500 text-sm">
        AI Assistant
      </div>

      {/* Chat area */}
      <div className="flex flex-col gap-2 overflow-y-auto bg-zinc-900 p-4">

        {chatHistory.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
            Chats will appear here
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-sm text-xs leading-relaxed ${
                  msg.startsWith("AI")
                    ? "bg-zinc-700 text-zinc-100"
                    : msg.startsWith("YOU")
                    ? "bg-blue-900/60 text-blue-200"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {msg}
              </div>
            ))}

            {loading && (
              <div className="px-3 py-2 rounded-sm text-xs bg-zinc-700 text-zinc-300 w-fit animate-pulse">
                AI is typing...
              </div>
            )}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center bg-zinc-950 px-4 gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type something..."
          disabled={loading}
          className="flex-1 px-4 py-2 bg-zinc-800 rounded-sm text-[12px] outline-none text-white border-none disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="h-8 w-10 flex items-center justify-center pl-2 bg-slate-600 text-white rounded-sm hover:bg-slate-500 transition disabled:opacity-50"
        >
          <IoSend className="text-black" />
        </button>
      </div>

    </div>
  );
}

export default AIChat;