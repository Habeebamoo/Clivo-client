"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "@/public/logo2.png";
import googleImg from "@/public/google.png";

const AdminLoginPage = () => {
  const googleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/admin/google`;
  };

  return (
    <div className="min-h-screen flex-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex-center mb-8">
          <Image src={logoImg} alt="Clivo" className="h-10 w-auto" />
        </div>
        <h1 className="font-inter text-2xl text-center mb-2">Admin Portal</h1>
        <p className="font-jsl text-accent text-sm text-center mb-8">
          Sign in to access the admin dashboard
        </p>

        <button
          onClick={googleSignIn}
          className="w-full py-3 border border-muted flex-center gap-3 font-inter text-sm hover:bg-mutedLight active:bg-mutedLight rounded-sm"
        >
          <Image src={googleImg} alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;