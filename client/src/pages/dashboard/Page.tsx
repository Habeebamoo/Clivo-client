import { useState } from "react"
import FYPSection from "../../components/FYP"
import FeedSection from "../../components/Feed"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"fyp" | "feed">("fyp")

  const toggleTab = (tab: "fyp" | "feed") => {
    setActiveTab(tab)
  }

  return (
    <main>
      {/* Tabs */}
      <div className="w-[90%] sm:w-[400px] mx-auto grid grid-cols-2 text-sm font-exo mb-3">
        <div 
          onClick={() => toggleTab("fyp")} 
          className={`${activeTab == "fyp" ? "home-tab-active" : "home-tab"}`}
        >
          For You
        </div>
        <div 
          onClick={() => toggleTab("feed")} 
          className={`${activeTab == "feed" ? "home-tab-active" : "home-tab"}`}
        >
          Feed
        </div>
      </div>

      {/* Posts */}
      <section className="w-[90%] sm:w-[400px] md:w-[500px] mx-auto">
        {activeTab == "fyp" && <FYPSection />}
        {activeTab == "feed" && <FeedSection />}
      </section>
    </main>
  )
}

export default Dashboard