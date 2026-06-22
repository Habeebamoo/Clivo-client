import { H2 } from "./typo";
import avatarImg from "@/public/avatar.png";
import errorImg from "@/public/error.png";
import Image from "next/image";

const NotFound = ({
  img = "a",
  text,
  subText,
}: {
  img?: "a" | "b";
  text: string;
  subText: string;
}) => {
  return (
    <div className="flex-center flex-col mt-20">
      <Image
        src={img === "a" ? avatarImg : errorImg}
        alt={text}
        className={img === "a" ? "h-70 w-auto" : "h-60 w-auto"}
      />
      <H2 font="inter" text={text} others="mt-6 text-center dark:text-stone-300" />
      <p className="w-[60%] text-sm text-center mt-2 text-accent dark:text-stone-400 font-inter">
        {subText}
      </p>
    </div>
  );
};

export default NotFound;
