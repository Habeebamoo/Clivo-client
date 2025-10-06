import { H2 } from "./Typo"
import avatar from "../assets/avatar.jpg"

const NotFound = ({ text, subText }: { text: string, subText: string }) => {
  return (
    <div className="flex-center flex-col mt-20">
      <img src={avatar} className="h-70" />
      <H2 font="inter" text={text} others="mt-6 text-center" />
      <p className="w-[60%] text-sm text-center mt-2 text-accent font-exo">{subText}</p>
    </div>
  )
}

export default NotFound