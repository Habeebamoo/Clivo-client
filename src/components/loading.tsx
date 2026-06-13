"use client";

import { useEffect, useState } from "react";

const Loading = () => {
  const word = "Clivo";
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < word.length) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 800);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(word.slice(0, displayed.length - 1));
        } else {
          setDeleting(false);
        }
      }
    }, deleting ? 80 : 150);

    return () => clearTimeout(timeout);
  }, [displayed, deleting]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex-center">
      <h1 className="font-inter font-bold text-5xl tracking-tight">
        {displayed}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
};

export default Loading;