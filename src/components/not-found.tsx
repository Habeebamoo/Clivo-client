import { H2 } from "./typo";
import avatarImg from "@/public/avatar.png";
import errorImg from "@/public/error.png";
import Image from "next/image";

const NotFound = ({
  img = "a",
  text,
  subText,
  darkThemeStyle,
  removedMargin
}: {
  img?: "a" | "b";
  text: string;
  subText: string;
  darkThemeStyle?: boolean;
  removedMargin?: boolean;
}) => {
  return (
    <div className={`flex-center flex-col ${!removedMargin && "mt-20" }`}>
      <Image
        src={img === "a" ? avatarImg : errorImg}
        alt={text}
        className={img === "a" ? "h-70 w-auto" : "h-60 w-auto"}
      />
      <H2 
        font="inter" 
        text={text} 
        // Conditionally appends 'dark:text-stone-300' if darkThemeStyle is true
        others={`mt-6 text-center ${darkThemeStyle ? "dark:text-stone-300" : ""}`} 
      />
      <p className={`w-[60%] text-sm text-center mt-2 text-accent font-inter ${
        darkThemeStyle ? "dark:text-stone-400" : ""
      }`}>
        {subText}
      </p>
    </div>
  );
};

export default NotFound;