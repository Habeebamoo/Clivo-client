"use client";

import { useRouter } from "next/navigation";
import { LuArrowUpRight } from "react-icons/lu";
import { motion } from "framer-motion";
import { slideDown } from "@/src/utils/animation";
import Image from "next/image";
import logoImg from "@/public/logo2.png";

const RegisterModal = () => {
  const router = useRouter();

  return (
    <div className="fixed z-40 top-0 left-0 bottom-0 right-0 bg-black/80 flex-center">
      <motion.div
        initial="hidden"
        animate="show"
        variants={slideDown}
        className="bg-white rounded-lg p-6 w-[90%] sm:w-100"
      >
        <div className="flex-center">
          <Image src={logoImg} alt="Clivo" className="h-8 md:h-12 w-auto" />
        </div>
        <h2 className="text-2xl md:text-3xl font-outfit text-center mt-4">
          Join Clivo
        </h2>
        <p className="text-sm text-gray-600 font-jsl text-center mt-2">
          Create an account to discover and share amazing content.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="btn-primary flex-center gap-3 w-full mt-6 py-3"
        >
          <span>Sign Up</span>
          <LuArrowUpRight />
        </button>
      </motion.div>
    </div>
  );
};

export default RegisterModal;
