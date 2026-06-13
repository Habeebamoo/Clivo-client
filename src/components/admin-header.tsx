"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import logoImg from "@/public/logo2.png";

const AdminHeader = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/signout`,
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
      router.push("/admin");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-b-muted">
      <div className="max-w-5xl mx-auto px-4 flex-between h-14">
        <Image src={logoImg} alt="Clivo" className="h-7 w-auto" />
        <button
          onClick={signOut}
          className="text-sm font-inter text-red-400 hover:text-red-600"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
