"use client";

import { useFetchUser } from "@/src/hooks/useFetchUser";
import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import type { RootState } from "@/src/redux/store";
import type { Post } from "@/src/types/article";
import type { User } from "@/src/types/user";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { BiLink } from "react-icons/bi";
import { H2 } from "./typo";
import ArticleDisplay from "./article-display";
import Spinner from "./spinner";
import NotFound from "./not-found";
import Header from "./header";
import Loading from "./loading";

interface UserPageProps {
  username: string;
}

const UserPage = ({ username }: UserPageProps) => {
  // Fire Redux data fetch hooks directly using explicit string props
  useFetchProfile();
  const { data, isLoading, isError } = useFetchUser(username);

  // Redux Profile State Hooks
  const me: User = useSelector(
    (state: RootState) => state.user.profile as User
  );

  // Profile Context Properties
  const user = data?.user;
  const articles = data?.userArticles || [];
  const isProfileOwner = me?.username === decodeURIComponent(username);

  // Local Interaction States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Synchronize follow parameters on component initialization
  useEffect(() => {
    if (!me?.userId || !username) return;

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/follow-status/${me.userId}/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
            },
          }
        );
        const response = await res.json();
        if (response.success) {
          setIsFollowing(response.data.status);
        }
      } catch (error) {
        console.error("Failed to query follow relation status:", error);
      }
    };

    fetchFollowStatus();
  }, [me?.userId, username]);

  // Handle follow/unfollow updates optimistically 
  const toggleFollow = async () => {
    if (!me?.userId) return;

    if (isProfileOwner) {
      toast.error("You can't follow yourself");
      return;
    }

    setFollowLoading(true);
    const initialFollowState = isFollowing;
    setIsFollowing(!initialFollowState);

    const path = initialFollowState ? "unfollow" : "follow";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${path}/${username}`,
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
        setIsFollowing(initialFollowState); // Rollback state
        toast.error(response.message || "Action failed");
        return;
      }

      toast.success(response.message);
    } catch {
      setIsFollowing(initialFollowState); // Rollback state
      toast.error("Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (isError || !user) {
    return (
      <NotFound
        img="b"
        text="User not found"
        subText="This user doesn't exist or has been removed."
      />
    );
  }

  return (
    <>
      <Header type="article" />
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-14 lg:mt-20 max-w-5xl mx-auto items-start pb-24 px-4">
        
        {/* Left Hand Profile Frame Card */}
        <section className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm bg-white pb-8">
          
          {/* Banner Container Section */}
          <div className="h-40 bg-stone-100 relative flex flex-col justify-center items-center px-4 text-center">
            <H2 font="exo" text="Clivo" others="text-xl tracking-wide text-stone-800" />
            <p className="text-[12px] text-accentLight mt-1 font-outfit">
              Where Simple Stories Find Their Voices
            </p>

            {/* Absolute Overlapping Avatar Profile Ring */}
            <div className="bg-white p-1 h-26 w-26 rounded-full flex-center absolute left-8 -bottom-13 shadow-sm">
              <div className="h-full w-full rounded-full overflow-hidden border border-stone-100">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-stone-200" />
                )}
              </div>
            </div>
          </div>

          {/* User Details Form Grid Context */}
          <div className="mt-16 px-8">
            {/* Display Fullname Identity */}
            <div className="flex-start gap-2">
              <H2 font="inter" text={user.name} others="text-xl font-bold text-stone-900" />
              {user.verified && (
                <MdVerified size={18} color="rgba(93, 110, 189, 1)" />
              )}
            </div>

            {/* Handle Username Reference */}
            <p className="text-[13px] text-stone-400 font-mono mt-0.5">{user.username}</p>

            {/* Custom Description Text */}
            {user.bio && (
              <p className="font-outfit text-sm text-stone-600 mt-4 leading-relaxed max-w-md">
                {user.bio}
              </p>
            )}

            {/* Dynamic Verified Website Hyperlink Anchor */}
            {user.website && (
              <div className="flex-start gap-1 mt-4 text-stone-500 hover:text-blue-600 transition">
                <BiLink size={16} />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] underline font-medium truncate max-w-xs"
                >
                  {user.website}
                </a>
              </div>
            )}
            
            {/* Social Network Tracker Counters */}
            <div className="text-sm text-stone-500 font-inter flex-start mt-4 gap-2">
              <p className="font-medium text-stone-800">
                {user.following} <span className="text-stone-400 font-normal">Following</span>
              </p>
              <div className="h-1 w-1 bg-stone-300 rounded-full" />
              <p className="font-medium text-stone-800">
                {user.followers} <span className="text-stone-400 font-normal">Followers</span>
              </p>
            </div>

            {/* Actions Display Area */}
            {me?.userId && !isProfileOwner && (
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className="btn-primary px-6 py-2.5 mt-6 text-sm rounded-full transition disabled:opacity-60"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </section>

        {/* Separator Border Divider line for mobile screens */}
        <hr className="lg:hidden border-stone-100 my-4" />
        
        {/* Right Hand Side Stream Stream Grid Feed */}
        <section className="lg:px-4 space-y-6">
          {articles.length === 0 ? (
            <div className="flex-center flex-col py-16 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
              <div className="h-16 w-16 bg-stone-100 rounded-full flex-center text-stone-400 mb-4 font-mono text-xl">
                ✍️
              </div>
              <H2
                font="inter"
                text="This user hasn't posted anything!"
                others="text-stone-500 text-base font-medium text-center px-4"
              />
            </div>
          ) : (
            <div className="space-y-4 px-4">
              {[...articles].reverse().map((article: Post) => (
                <ArticleDisplay key={article.articleId} article={article} />
              ))}
            </div>
          )}
        </section>

      </main>
    </>
  );
};

export default UserPage;