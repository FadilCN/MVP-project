import TopBar from "../ui/elements/components/Dashboard/TopBar"
import Welcome from "../ui/elements/components/Dashboard/welcome"
import AvailableProj from "../ui/elements/components/Dashboard/AvailableProj"

function DashBoard() {
  return (
    <div className="grid grid-rows-[auto_34%_1fr] h-screen w-screen overflow-hidden">
      <TopBar />
      <Welcome />
      <AvailableProj />
    </div>
  )
}

export default DashBoard