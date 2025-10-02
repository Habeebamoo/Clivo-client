import { H2 } from "./Typo"
import avatar from "../assets/avatar.jpg"

const NotFound = ({ text }: { text: string }) => {
  return (
    <div className="flex-center flex-col mt-20">
      <img src={avatar} className="h-70" />
      <H2 font="inter" text={text} others="mt-6 text-center" />
      <p className="w-[60%] text-sm text-center mt-2 text-accent font-exo">This article has either been deleted or moved to a new URL</p>
    </div>
  )
}

export default NotFound