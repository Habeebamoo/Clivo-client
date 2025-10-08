import { BiMusic, BiPaint } from "react-icons/bi"
import { H1 } from "../../components/Typo"
import { MdScience } from "react-icons/md"
import { FaBuilding, FaGamepad, FaLaptop, FaRobot, FaRust, FaSpider, FaStar, FaStethoscope, FaSuitcase, FaUsers } from "react-icons/fa"
import { TbChefHat } from "react-icons/tb"
import { GiDress } from "react-icons/gi"
import { PiTelevisionFill } from "react-icons/pi"
import { RiGovernmentFill } from "react-icons/ri"
import { FaBookAtlas, FaGears, FaMoneyBill } from "react-icons/fa6"
import { SiCinema4D } from "react-icons/si"

interface Interest {
  icon: any,
  text: string
}

interface Props {
  interests: string[],
  setInterests: React.Dispatch<React.SetStateAction<string[]>>
}

const InterestsSection = ({ interests, setInterests }: Props) => {
  // list of interests
  const interestsArray: Interest[] = [
    {icon: <BiMusic color="blue" />, text: "Music"}, 
    {icon: <FaLaptop />, text: "Tech"}, 
    {icon: <FaSpider color="red" />, text: "Anime"},
    {icon: <MdScience color="blue" />, text: "Science"},
    {icon: <GiDress color="red" />, text: "Fashion"},
    {icon: <BiPaint color="brown" />, text: "Art"},
    {icon: <FaRust color="rgba(240, 36, 29, 1)" />, text: "Programming"},
    {icon: <FaStethoscope color="blue" />, text: "Medicine"},
    {icon: <PiTelevisionFill color="brown" />, text: "Entertainment"},
    {icon: <RiGovernmentFill color="brown" />, text: "Government"},
    {icon: <FaGears />, text: "Engineering"},
    {icon: <FaMoneyBill color="rgba(172, 164, 164, 1)" />, text: "Economy"},
    {icon: <FaRobot color="brown" />, text: "Artificial Intelligence"},
    {icon: <FaUsers color="orange" />, text: "Lifestyle"},
    {icon: <FaBookAtlas color="purple" />, text: "Education"},
    {icon: <FaSuitcase color="brown" />, text: "Business"},
    {icon: <FaStar color="rgba(28, 165, 131, 1)" />, text: "Astrology"},
    {icon: <TbChefHat  />, text: "Food"},
    {icon: <FaBuilding color="brown" />, text: "Construction"},
    {icon: <SiCinema4D />, text: "Movies"},
    {icon: <FaGamepad color="blue" />, text: "Gaming"}
  ];

  const selected = (interest: string): boolean => {
    const isSelected = interests.find((text) => text === interest)
    return isSelected ? true : false
  }

  const addInterest = (text: string) => {
    if (interests.length < 3) {
      setInterests(prev => ([...prev, text]))
    }
  }

  const removeInterest = (text: string) => {
    const foundInterest = interests.find(val => text === val)
    if (foundInterest) {
      setInterests(interests.filter(val => val != text))
    }
  }

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-white">
      <div className="mt-15"></div>
      <H1 font="inter" text="Choose Your Interests" others="text-center" />

      {/* interests */}
      <div className="flex-center gap-4 w-[70%] sm:w-[400px] mx-auto mt-10 flex-wrap">
        {interestsArray.map((obj: Interest) => {
          return (
            <InterestBadge 
              icon={obj.icon} 
              text={obj.text} 
              selected={selected(obj.text)} 
              interests={interests} 
              addInterest={addInterest} 
              removeInterest={removeInterest} 
            />
          )
        })}
      </div>

      <div className="mb-15"></div>
    </section>
  )
}

// Interest Badge component 

type BadgeProps = {
  icon: any, 
  text: string, 
  selected: boolean, 
  interests: string[],
  addInterest: (text: string) => void,
  removeInterest: (text: string) => void,
}

const InterestBadge = ({ icon, text, selected, interests, addInterest, removeInterest }: BadgeProps) => {
  const interestExists = interests.find(val => val === text)

  return (
    <div
      onClick={interestExists ? () => removeInterest(text) : () => addInterest(text)} 
      className={`${selected ? "bg-black text-white" : "bg-muted"} py-2 px-4 rounded-full flex-center gap-2 hover:bg-accentLight active:bg-black active:text-white cursor-pointer text-sm`}>
      {icon}
      <span>{text}</span>
    </div>
  )
}

export default InterestsSection