"use client";

import { motion } from "framer-motion";
import { slideDown } from "@/src/utils/animation";
import Image from "next/image";
import checkImg from "@/public/checkmark.png";

const SubscribeModal = () => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/80 flex-center z-30">
      <motion.div
        initial="hidden"
        animate="show"
        variants={slideDown}
        className="bg-white rounded-lg px-6 py-12 w-[90%] sm:w-100"
      >
        <div className="flex-center">
          <Image src={checkImg} alt="success" className="h-14 w-auto" />
        </div>
        <h1 className="font-outfit text-xl text-center mt-6 md:text-2xl">
          Thanks for subscribing
        </h1>
        <p className="font-jsl text-center mt-4 text-sm">
          You will now receive our newsletter with the latest stories, writing
          tips, and exclusive content. We&apos;re excited to have you on board!
        </p>
      </motion.div>
    </div>
  );
};

export default SubscribeModal;
