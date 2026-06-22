"use client";

import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import type { RootState } from "@/src/redux/store";
import type { User } from "@/src/types/user";
import { useState } from "react";
import { MdVerified } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import logoImg from "@/public/logo2.png";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  type: "home" | "article" | "landing";
}

const Header = ({ type }: Props) => {
  useFetchProfile();
  const router = useRouter();
  const user: User = useSelector(
    (state: RootState) => state.user.profile as User
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        toast.error(response.message);
        return;
      }
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-20 bg-white border-b border-b-muted ${
        type === "home" ? "dark:bg-stone-950 dark:border-b-stone-800" : "[&_*]:!dark:bg-transparent [&_*]:!dark:text-inherit [&_*]:!dark:border-inherit"
      }`}
    >
      {/* 
        By wrapping the inner elements in a conditional class block, we force standard 
        light behavior for landing/article types even if the HTML element has the 'dark' class.
      */}
      <div className={type === "home" ? "" : "theme-light scheme-light"}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex-between">
          {/* Logo */}
          <Link href={user.userId ? "/home" : "/"}>
            <Image 
              src={logoImg} 
              alt="Clivo" 
              className={`h-9 w-auto ${type === "home" ? "dark:invert" : ""}`} 
            />
          </Link>

          {/* Right side */}
          <div className="flex-center gap-4">
            {type === "home" && user.userId && (
              <Link
                href="/home/create"
                className="flex-center gap-1 text-accent dark:text-stone-300 hover:text-primary dark:hover:text-white font-inter text-sm"
              >
                <RiPencilLine size={18} />
                <span className="max-sm:hidden">Write</span>
              </Link>
            )}

            {user.userId ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex-center gap-1 focus:outline-none cursor-pointer"
                >
                  {user.picture ? (
                    <div className={`h-8 w-8 rounded-full overflow-hidden border border-muted ${type === "home" ? "dark:border-stone-800" : ""}`}>
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`h-8 w-8 rounded-full bg-muted border border-accentLight ${type === "home" ? "dark:bg-stone-800 dark:border-stone-700" : ""}`} />
                  )}
                  <div className="flex-center gap-1 max-sm:hidden ml-2">
                    <span className={`font-inter text-sm text-stone-900 ${type === "home" ? "dark:text-stone-100" : ""}`}>{user.name}</span>
                    {user.verified && (
                      <MdVerified size={16} color="rgba(93, 110, 189, 1)" />
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 top-10 bg-white border border-muted rounded-lg shadow-md w-44 z-30 ${type === "home" ? "dark:bg-stone-900 dark:border-stone-800" : ""}`}>
                    <Link
                      href="/home/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-inter text-stone-700 hover:bg-mutedLight ${type === "home" ? "dark:text-stone-300 dark:hover:bg-stone-800/60" : ""}`}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/home/settings"
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-inter text-stone-700 hover:bg-mutedLight ${type === "home" ? "dark:text-stone-300 dark:hover:bg-stone-800/60" : ""}`}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={signOut}
                      className={`block w-full text-left px-4 py-3 text-sm font-inter hover:bg-mutedLight text-red-400 dark:text-red-400 cursor-pointer ${type === "home" ? "dark:hover:bg-stone-800/60" : ""}`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="btn-primary text-sm py-2 px-4"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;