import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoLogoCodepen } from "react-icons/io";
import Cookies from "js-cookie";

function TopBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      await axios.post(
      "http://localhost:3000/users/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex bg-zinc-950 font-bold items-center pl-2 h-12 shrink-0 text-[22px] text-slate-300 gap-2">
      <IoLogoCodepen className="text-slate-500 text-[25px]" />
      <span className="pl-2">Codable</span>

      <button
        onClick={handleLogout}
        className="ml-auto mr-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

export default TopBar;