import { H2 } from "./Typo"
import avatar from "../assets/avatar.jpg"
import errorImg from "../assets/error.jpg"

const NotFound = ({ img="a", text, subText }: { img?: "a" | "b", text: string, subText: string }) => {
  return (
    <div className="flex-center flex-col mt-20">
      <img src={img === "a" ? avatar : errorImg} className={`${img == "a" ? "h-70" : "h-60"}`} />
      <H2 font="inter" text={text} others="mt-6 text-center" />
      <p className="w-[60%] text-sm text-center mt-2 text-accent font-inter">{subText}</p>
    </div>
  )
}

export default NotFound