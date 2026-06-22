"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import errorImg from "@/public/error.png";
import { H1 } from "./typo";

const ErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <main className="flex-center">
      <div className="flex-center flex-col mt-30">
        <Image src={errorImg} alt="Error" className="h-50 w-auto" />
        <H1 font="inter" text="Google Login Failed" />

        <p className="mt-2 text-sm font-outfit text-accent">
          We appologize for the incovinience right now
        </p>
        <p className="mt-2 text-[10px] font-inter text-accent">
          ERR_STATUS: {reason || "Something went wrong."}
        </p>

        <button
          onClick={() => router.push("/signin")}
          className="btn-primary text-sm font-inter mt-4 py-2 px-4"
        >
          Try Again
        </button>
      </div>
    </main>
  );
};

export default ErrorPage;