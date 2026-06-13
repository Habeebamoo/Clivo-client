"use client";

import { useEffect, useState } from "react";
import { H1 } from "./typo";

const Loading = () => {
  const word = "Clivo";
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [forward, setForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (forward) {
        if (index < word.length) {
          setText(word.slice(0, index + 1));
          setIndex(index + 1);
        } else {
          setForward(false);
        }
      } else {
        if (index > 0) {
          setText(word.slice(0, index - 1));
          setIndex(index - 1);
        } else {
          setForward(true);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [index, forward]);

  return (
    <div className="bg-white fixed top-0 bottom-0 left-0 right-0 flex-center z-30">
      <H1 font="inter" text={`${text}|`} others="text-[55px]" />
    </div>
  );
};

export default Loading;
