import { useState } from 'react'
import { FaHome } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { FaInbox } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { IoLogoCodepen } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import CreateFile from './CreateFile';
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function FileBrowser(props) {
const [popup, setPopup] = useState(false);
const fileId=props.fileId


const navigate = useNavigate()
const handleHome = () => {
    navigate("/");

}; // Set fileId to null to clear the file data

const handleDelete = async (currentFileId) => {
  try {
    const token = Cookies.get("token");

    await axios.delete(
      `http://localhost:3000/files/${currentFileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Deleted:", currentFileId);
    props.loadFiles();

  } catch (err) {
    console.log("Delete failed:", err);
  }
};

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
      <FaHome className="text-slate-500 text-xl cursor-pointer hover:text-white transition" 
      onClick={() => {
        handleHome();
      }}
      />
         <IoMdShare className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
         <FaInbox className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
            <FaTasks className="text-slate-500 text-xl cursor-pointer hover:text-white transition" />
    </div>

    {/* Content */}
    <div className="flex flex-col gap-1 p-4 text-slate-300">
      <div className='px-1 mb-2 text-sm font-bold text-slate-300'>{props.projectName}</div>

    <button className="h-5 w-25 flex items-center justify-center bg-slate-600 text-white rounded-sm hover:bg-slate-500 transition"
    onClick={() => {
                setPopup(true);
              }} 
    >
  <span className=" text-[12px] ">+ New File</span>
</button>

{(props.fileName  || []).map((file, index) => (
  
  <div
    key={index}
    className="rounded-sm px-2 py-1 text-xs text-slate-500 flex items-center gap-2 hover:bg-zinc-800 hover:text-slate-300 transition-all duration-200 cursor-pointer group"
    onClick={() => {
      
      props.setSelectedIndex(index);
      props.setTopic(file);
      
    }}
  >
    <span className="flex-1 truncate">{file.name ?? file}</span>

    
    

   <FiTrash2
  className="opacity-0 group-hover:opacity-100 hover:text-red-400"
  size={12}
  onClick={(e) => {
    e.stopPropagation(); // ← uncomment this first
    const id = fileId[index]; // capture at render time
    console.log("single id:", id);
    console.log("full array:", fileId);
    handleDelete(id);
    
  }}
/>
  </div>
))}
      
      </div>
     
    </div>
      {popup && <CreateFile
      setPopup={setPopup}
      loadFiles={props.loadFiles}
      />}
      </div>
      
        
    </>
  )
}

export default FileBrowser
