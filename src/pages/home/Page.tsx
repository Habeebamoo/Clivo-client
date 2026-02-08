import { useState } from "react"
import FYPSection from "../../components/FYP"
import FeedSection from "../../components/Feed"

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"fyp" | "feed">("fyp")

  const toggleTab = (tab: "fyp" | "feed") => {
    setActiveTab(tab)
  }

  return (
    <main>
      <section className="w-[90%] sm:w-100 md:w-125 mx-auto">
        {/* Tabs */}
        <div className="flex-start text-[12px] mt-20">
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
        {activeTab == "fyp" && <FYPSection />}
        {activeTab == "feed" && <FeedSection />}
      </section>
    </main>
  )
}

export default HomePage