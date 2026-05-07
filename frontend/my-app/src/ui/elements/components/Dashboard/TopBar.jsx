import { IoLogoCodepen } from "react-icons/io"

function TopBar() {
  return (
    <div className="flex bg-zinc-950 font-bold items-center pl-2 h-12 shrink-0 text-[22px] text-slate-300 gap-2">
      <IoLogoCodepen className="text-slate-500 text-[25px]" />
      <span className="pl-2">Codable</span>
    </div>
  )
}

export default TopBar