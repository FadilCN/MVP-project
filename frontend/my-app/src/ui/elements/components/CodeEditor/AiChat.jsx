import { useState } from "react";
import { IoSend } from "react-icons/io5";

function AIChat() {
  const [value, setValue] = useState("");

  return (
    <div className="grid grid-rows-[8%_92%] h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-center bg-zinc-950 font-bold text-slate-500 text-sm">
        AI Assistant
      </div>

      {/* Input area */}
        
      <div className="flex flex-rows  justify-space-between bg-zinc-900 p-4 ">
         <div className="flex h-10 flex-row gap-2 items-center">   
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
          className="w-full px-4 py-2 border-none bg-zinc-800 rounded-sm text-[12px] outline-none focus:non focus:border-none"
        />

        <button className=" h-8 w-10 item-center justify-center pl-2 bg-slate-600 text-white rounded-sm hover:bg-slate-500 transition">
          <IoSend  className="text-black"/>
        </button>
        </div>

      </div>

    </div>
  );
}

export default AIChat