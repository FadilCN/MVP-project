import { useState } from 'react'
import { FaHome } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { FaInbox } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { IoLogoCodepen } from "react-icons/io";

function FileBrowser(props) {

  return (
    <>
     
        <div className="grid grid-rows-[8%_92%] h-screen">

  {/* Top bar */}
  <div className="flex bg-zinc-950 font-bold items-center pl-2 text-[22px] text-slate-300 gap-2">
    <div> <IoLogoCodepen className="text-slate-500 text-[25px] " /> </div>
    <span className='pl-2'>Codable</span>
  </div>

  {/* Main layout */}
  <div className="grid grid-cols-[20%_80%] bg-zinc-900">

    {/* Sidebar */}
    <div className="flex flex-col justify-end items-center gap-6 pb-6 bg-zinc-950 text-white">
      <FaHome className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
         <IoMdShare className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
         <FaInbox className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
            <FaTasks className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
    </div>

    {/* Content */}
    <div className="flex flex-col gap-1 p-4 text-slate-300">
      <div className='px-1 mb-2 text-sm font-bold text-slate-300'>PROJECT 1</div>

    {props.fileName.map((file, index) => (
  <div 
    key={index}
    className="rounded-sm px-2 py-1 text-xs text-slate-500 flex items-center gap-2 hover:bg-zinc-800 hover:text-slate-300 transition-all duration-200 cursor-pointer"
    onClick={() => {
      props.setSelectedIndex(index);
      props.setTopic(file);
    }}
  >
    <FaFile className="text-blue-500 text-sm" />

    <span className="transition-transform duration-200 group-hover:translate-x-1">
      {file}
    </span>
  </div>
))}



      </div>
      
    </div>

  </div>
      
        
    </>
  )
}

export default FileBrowser
