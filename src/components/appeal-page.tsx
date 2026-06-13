"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import logoImg from "@/public/logo2.png";
import Spinner from "./spinner";

const AppealPage = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const options = [
    "My account was banned by mistake",
    "I have corrected my behavior",
    "I believe the ban was unfair",
    "Other",
  ];

  const sendAppeal = async () => {
    if (!selected) {
      toast.error("Please select a reason");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}/appeal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            message: `${selected}${message ? `: ${message}` : ""}`,
          }),
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex-center mb-8">
          <Image src={logoImg} alt="Clivo" className="h-10 w-auto" />
        </div>
        <h1 className="font-inter text-2xl text-center mb-2">
          Submit an Appeal
        </h1>
        <p className="font-jsl text-accent text-sm text-center mb-8">
          Your account has been suspended. If you believe this was a mistake,
          submit an appeal below.
        </p>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => setSelected(option)}
              className={`appeal-radio ${
                selected === option ? "border-primary" : ""
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full border-2 flex-center ${
                  selected === option
                    ? "border-primary"
                    : "border-accentLight"
                }`}
              >
                {selected === option && (
                  <div className="h-2 w-2 bg-primary rounded-full" />
                )}
              </div>
              <span className="font-inter text-sm">{option}</span>
            </div>
          ))}
        </div>

        <textarea
          rows={4}
          placeholder="Add more details (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-muted rounded-lg p-3 font-open text-sm focus:outline-none resize-none mb-6"
        />

        {loading ? (
          <button className="w-full py-3 bg-primary text-white flex-center cursor-not-allowed rounded-sm">
            <Spinner size={18} color="white" />
          </button>
        ) : (
          <button onClick={sendAppeal} className="btn-primary w-full py-3">
            Submit Appeal
          </button>
        )}
      </div>
    </div>
  );
};

export default AppealPage;
