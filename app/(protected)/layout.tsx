"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/header";
import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/redux/store";
import type { User } from "@/src/types/user";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isError } = useFetchProfile();
  const user: User = useSelector(
    (state: RootState) => state.user.profile as User
  );

  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/signin");
    }
  }, [isLoading, isError, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-200">
      <Header type="home" />
      <div className="mt-18">{children}</div>
    </div>
  );
}