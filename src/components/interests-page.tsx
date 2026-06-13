"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdScience } from "react-icons/md";
import { FaBookOpen, FaBriefcase, FaCamera, FaChartLine, FaChurch, FaCode, FaFilm, FaGamepad, FaHeart, FaHome, FaLandmark, FaLaptopCode, FaMagic, FaMoneyBillWave, FaMusic, FaPaintBrush, FaPaw, FaPlane, FaRobot, FaShoppingCart, FaSquareRootAlt, FaTheaterMasks, FaTshirt, FaUserFriends, FaWallet } from "react-icons/fa";
import { TbChefHat } from "react-icons/tb";
import { GiEarthAfricaEurope, GiMicrochip, GiWeightLiftingUp } from "react-icons/gi";
import { FaBasketball } from "react-icons/fa6";
import { SiGooglecloud } from "react-icons/si";
import { H1 } from "./typo";
import Loading from "./loading";

interface Interest {
  icon: React.ReactNode;
  text: string;
}

const interestsArray: Interest[] = [
  { text: "Programming", icon: <FaCode color="#0078D7" /> },
  { text: "Software Developement", icon: <FaLaptopCode color="#2b89a3ff" /> },
  { text: "Cybersecurity", icon: <GiMicrochip color="#c41e3a" /> },
  { text: "Artificial Intelligence", icon: <FaRobot color="#FF9800" /> },
  { text: "Cloud Computing", icon: <SiGooglecloud color="#4285f4" /> },
  { text: "Gaming", icon: <FaGamepad color="#9c27b0" /> },
  { text: "Graphics Design", icon: <FaPaintBrush color="#e91e63" /> },
  { text: "Photography", icon: <FaCamera color="#9c27b0" /> },
  { text: "Music", icon: <FaMusic color="#f44336" /> },
  { text: "Animation", icon: <FaMagic color="#9c27b0" /> },
  { text: "Fashion", icon: <FaTshirt color="#ff4081" /> },
  { text: "Science", icon: <MdScience color="#4caf50" /> },
  { text: "History", icon: <FaBookOpen color="#795548" /> },
  { text: "Psychology", icon: <FaUserFriends color="#03a9f4" /> },
  { text: "Maths", icon: <FaSquareRootAlt color="#009688" /> },
  { text: "Career", icon: <FaBriefcase color="#607d8b" /> },
  { text: "Entrepreneurship", icon: <FaChartLine color="#009688" /> },
  { text: "Investment", icon: <FaMoneyBillWave color="#4caf50" /> },
  { text: "Finance", icon: <FaWallet color="#8bc34a" /> },
  { text: "E-commerce", icon: <FaShoppingCart color="#2196f3" /> },
  { text: "Real Estate", icon: <FaHome color="#9e9e9e" /> },
  { text: "Travel", icon: <FaPlane color="#03a9f4" /> },
  { text: "Food & Cooking", icon: <TbChefHat color="#ff7053" /> },
  { text: "Fitness", icon: <GiWeightLiftingUp color="#4caf50" /> },
  { text: "Relationships", icon: <FaHeart color="#f44336" /> },
  { text: "Culture", icon: <GiEarthAfricaEurope color="#00bcd4" /> },
  { text: "Wildlife", icon: <FaPaw color="#795548" /> },
  { text: "Politics", icon: <FaLandmark color="#607d8b" /> },
  { text: "Religion", icon: <FaChurch color="#9c27b0" /> },
  { text: "Sports", icon: <FaBasketball color="#ff9800" /> },
  { text: "Movies", icon: <FaFilm color="#2196f3" /> },
  { text: "Anime", icon: <FaTheaterMasks color="#e91e63" /> },
];

type BadgeProps = {
  icon: React.ReactNode;
  text: string;
  selected: boolean;
  interests: string[];
  addInterest: (text: string) => void;
  removeInterest: (text: string) => void;
};

const InterestBadge = ({ icon, text, selected, interests, addInterest, removeInterest }: BadgeProps) => {
  const interestExists = interests.find((val) => val === text);

  return (
    <div
      onClick={interestExists ? () => removeInterest(text) : () => addInterest(text)}
      className={`${selected && "bg-black text-white"} py-2 px-4 rounded-full flex-center gap-2 hover:bg-accentLight active:bg-black active:text-white cursor-pointer text-sm`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

const InterestsPage = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
  }, [token, router]);

  const selected = (interest: string): boolean => {
    return !!interests.find((text) => text === interest);
  };

  const addInterest = (text: string) => {
    if (interests.length < 10) {
      setInterests((prev) => [...prev, text]);
    }
  };

  const removeInterest = (text: string) => {
    setInterests(interests.filter((val) => val !== text));
  };

  const signUpUser = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
        },
        credentials: "include",
        body: JSON.stringify(interests),
      }
    );

    if (!res.ok) {
      router.push("/signin");
      return;
    }

    router.push("/home");
  };

  if (loading) return <Loading />;

  return (
    <section className="bg-white">
      <div className="mt-15" />
      <H1 font="inter" text="Choose Your Interests" others="text-center" />

      <div className="flex-center gap-4 w-[95%] sm:w-100 mx-auto mt-15 flex-wrap">
        {interestsArray.map((obj) => (
          <InterestBadge
            key={obj.text}
            icon={obj.icon}
            text={obj.text}
            selected={selected(obj.text)}
            interests={interests}
            addInterest={addInterest}
            removeInterest={removeInterest}
          />
        ))}
      </div>

      <button
        onClick={signUpUser}
        className="btn-primary block px-5 py-2 font-outfit mx-auto mt-20"
      >
        Submit
      </button>
      <div className="mb-15" />
    </section>
  );
};

export default InterestsPage;