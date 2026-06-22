"use client";

import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import type { RootState } from "@/src/redux/store";
import type { User } from "@/src/types/user";
import { useSelector } from "react-redux";
import { MdDateRange, MdVerified } from "react-icons/md";
import { BiLink, BiPencil, BiPlus } from "react-icons/bi";
import { H1, H2 } from "./typo";
import MyArticles from "./my-articles";
import Loading from "./loading";
import { useRouter } from "next/navigation";

const MyProfilePage = () => {
  const { isLoading } = useFetchProfile();
  const user: User = useSelector((state: RootState) => state.user.profile as User);
  const router = useRouter();

  if (isLoading) return <Loading />;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:w-225 mx-auto items-start">
      <section>
        {/* Profile Picture */}
        <div>
          <div className="h-40 bg-mutedLight dark:bg-stone-300 relative flex-center flex-col">
            <H1 font="exo" text="Clivo" color="accent dark:text-stone-800" />
            <p className="text-[12px] text-accentLight dark:text-stone-700 mt-1 font-exo">
              Where Simple Stories Find Thier Voices
            </p>

            {/* profile pic */}
            <div className="bg-white dark:bg-stone-300 p-1 h-26 w-26 rounded-full flex-center absolute left-7 -bottom-17.5">
              <div className="h-24 w-24 rounded-full overflow-hidden border border-accentLight">
                {user.picture ? (
                  <img src={user.picture} className="h-full w-full object-cover" alt={user.name} />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="mt-20 px-8">
          {/* Name */}
          <div className="flex-start gap-1">
            <h1 className="font-dm text-2xl dark:text-gray-200">{user.name ?? ""}</h1>
            {user.verified ? (
              <MdVerified size={18} color="rgba(93, 110, 189, 1)" />
            ) : (
              <a
                href="https://myclivo.com/@clivoinc/how-to-become-a-verified-user-124"
                className="text-[12px] underline cursor-pointer"
              >
                Get Verified
              </a>
            )}
          </div>

          {/* Username */}
          <p className="text-[12px] text-accentLight underline font-inter">
            {user.username}
          </p>

          {/* Bio */}
          <p className="font-outfit text-sm text-accent dark:text-gray-300 mt-4">{user.bio}</p>

          {/* Website */}
          {user.website && (
            <div className="flex-start gap-1 mt-4">
              <BiLink className="dark:text-gray-300" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-[12px] cursor-pointer"
              >
                {user.website}
              </a>
            </div>
          )}

          {/* Follows */}
          <div className="text-sm text-accent font-inter flex-start mt-4 gap-2 dark:text-gray-300">
            <p>{user.following} Following</p>
            <div className="h-1 w-1 bg-accentLight rounded-full" />
            <p>{user.followers} Followers</p>
          </div>

          {/* Joined date */}
          <div className="mt-3 flex-start gap-2 text-[12px] font-exo text-accent dark:text-gray-300">
            <MdDateRange size={16} />
            <p>Joined {user.createdAt}</p>
          </div>

          <div className="mt-6 flex-start gap-4">
            <button
              onClick={() => router.push("/home/settings")}
              className="text-sm flex-center gap-2 py-2 px-3 dark:bg-stone-200 border border-muted dark:border-stone-100 rounded-full hover:bg-muted active:bg-muted cursor-pointer font-outfit"
            >
              <BiPencil />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => router.push("/home/create")}
              className="text-sm flex-center gap-2 py-2 px-3 btn-primary rounded-full"
            >
              <BiPlus />
              <span>New Article</span>
            </button>
          </div>
        </div>
      </section>

      <hr className="lg:hidden text-mutedLight" />

      <section className="px-8 mb-20">
        <MyArticles />
      </section>
    </main>
  );
};

export default MyProfilePage;