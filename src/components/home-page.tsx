"use client";

import { useState } from "react";
import FYPSection from "./fyp";
import FeedSection from "./feed";

type Tab = "fyp" | "feed";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("fyp");

  return (
    <div className="w-[90%] sm:w-100 md:w-125 mx-auto">
      {/* Tabs */}
      <div className="flex-start text-[12px] mt-6 sm:mt-10">
        <div 
          onClick={() => setActiveTab("fyp")} 
          className={`${activeTab == "fyp" ? "home-tab-active" : "home-tab"}`}
        >
          For You
        </div>
        <div 
          onClick={() => setActiveTab("feed")} 
          className={`${activeTab == "feed" ? "home-tab-active" : "home-tab"}`}
        >
          Feed
        </div>
      </div>

      {activeTab === "fyp" ? <FYPSection /> : <FeedSection />}
    </div>
  );
};

export default HomePage;
