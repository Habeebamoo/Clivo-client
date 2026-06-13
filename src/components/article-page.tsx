"use client";

import { useFetchUserArticle } from "@/src/hooks/useFetchUserArticle";
import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import type { RootState } from "@/src/redux/store";
import type { Post } from "@/src/types/article";
import type { Comment } from "@/src/types/comment";
import type { User } from "@/src/types/user";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaUpload } from "react-icons/fa";
import { CgShare } from "react-icons/cg";
import { H2, H3 } from "./typo";
import BlockRenderer from "./block-renderer";
import CommentDisplay from "./comment-display";
import Spinner from "./spinner";
import NotFound from "./not-found";
import Header from "./header";
import RegisterModal from "./register-modal";

interface ArticlePageProps {
  username: string;
  title: string;
}

const ArticlePage = ({ username, title }: ArticlePageProps) => {
  const decodedUsername = decodeURIComponent(username);
  useFetchProfile();
  const { isLoading, isError } = useFetchUserArticle(decodedUsername, title);

  const article: Post = useSelector(
    (state: RootState) => state.articles.userArticle as unknown as Post
  );
  const comments: Comment[] = useSelector(
    (state: RootState) => state.articles.articleComments || []
  );
  const user: User = useSelector(
    (state: RootState) => state.user.profile as User
  );

  const [liked, setLiked] = useState(false);
  const [likeCountOffset, setLikeCountOffset] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentBarActive, setCommentBarActive] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const isProfileOwner = user?.username === decodedUsername;
  console.log("isProfileOwner:", isProfileOwner);
  console.log("user.username:", user?.username);
  console.log("username:", decodedUsername);

  useEffect(() => {
    if (!user?.userId || !decodedUsername) return;

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/follow-status/${user.userId}/${decodedUsername}`,
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
        console.error("Failed to fetch follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [user?.userId, username]);


  const likeArticle = async () => {
    if (!user?.userId) {
      setRegisterModal(true);
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCountOffset((prev) => (newLiked ? prev + 1 : prev - 1));

    const data = {
      articleId: article?.articleId,
      likerUserId: user.userId
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error();
    } catch {
      setLiked(!newLiked);
      setLikeCountOffset((prev) => (newLiked ? prev - 1 : prev + 1));
      toast.error("Failed to process request");
    }
  };

  const handleCommentAction = async () => {
    if (!user?.userId) {
      setRegisterModal(true);
      return;
    }

    if (!commentBarActive) {
      setCommentBarActive(true);
      return;
    }

    if (!commentValue.trim()) return;

    setSendingComment(true);

    const data = {
      articleId: article?.articleId,
      userId: user.userId,
      content: commentValue
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/comment/${article?.articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      const response = await res.json();
      
      if (!res.ok) {
        toast.error(response.message || "Could not post comment");
        return;
      }

      toast.success(response.message || "Comment shared!");
      setCommentValue("");
      setCommentBarActive(false);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSendingComment(false);
    }
  };

  const toggleFollow = async () => {
    if (!user?.userId) {
      setRegisterModal(true);
      return;
    }

    if (isProfileOwner) {
      toast.error("You can't follow yourself");
      return;
    }

    const previousFollowState = isFollowing;
    setIsFollowing(!isFollowing);

    const path = previousFollowState ? "unfollow" : "follow";
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
        setIsFollowing(previousFollowState);
        toast.error(response.message || "Action failed");
        return;
      }
      toast.success(response.message);
    } catch {
      setIsFollowing(previousFollowState);
      toast.error("Something went wrong.");
    }
  };

  const shareArticle = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center h-screen w-full">
        <Spinner size={32} color="accentLight" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <NotFound
        img="b"
        text="Couldn't Find Article"
        subText="This article has either been deleted or moved to a new URL"
      />
    );
  }

  return (
    <>
      {registerModal && <RegisterModal />}
      <Header type="article" />

      <main className="w-[90%] sm:w-125 md:w-150 mx-auto mt-14 pb-24">
        {/* Top Featured Cover Frame */}
        <div className="p-1 w-full mt-6">
          {article.picture ? (
            <div className="w-full max-h-95 overflow-hidden rounded-lg mb-4 mx-auto">
              <img
                src={article.picture}
                alt={article.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="bg-muted w-full h-36 rounded-lg mb-4" />
          )}
          <H2 font="exo" text={article.title} others="text-center mt-10 text-2xl md:text-3xl" />
        </div>

        {/* Story Metadata */}
        <div className="text-[12px] text-accentLight font-outfit flex-start gap-3 mt-8">
          <p>{article.readTime || "3 min"} read time</p>
          <div className="bg-accentLight h-1 w-1 rounded-full" />
          <p>{article.createdAt}</p>
        </div>

        {/* Small Profile/Author Identity line */}
        <div className="flex-start gap-3 mt-4">
          <a href={article.authorProfileUrl} className="h-8 w-8 rounded-full overflow-hidden cursor-pointer">
            {article.authorPicture ? (
              <img
                src={article.authorPicture}
                alt={article.authorFullname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-muted border border-accentLight" />
            )}
          </a>

          <div className="flex-start gap-2">
            <a href={article.authorProfileUrl} className="font-inter text-sm hover:underline">
              {article.authorFullname}
            </a>
            {article.authorVerified && (
              <MdVerified color="rgba(93, 110, 189, 1)" size={16} />
            )}
          </div>
        </div>

        {/* Interactive Quick Context Callouts */}
        <div className="flex-start gap-2 mt-6">
          {!isProfileOwner && (
            <button
              onClick={toggleFollow}
              className="btn-primary text-[12px] px-4 py-1.5 rounded-full font-inter"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <button
            onClick={shareArticle}
            className="text-[12px] flex-center gap-1 border border-accent py-1.5 px-4 rounded-full cursor-pointer text-black hover:bg-muted active:bg-muted transition"
          >
            <FaUpload className="text-[10px]" />
            <span>Share</span>
          </button>
        </div>

        <hr className="border-muted mt-6 mb-4" />

        {/* Article Render Body Canvas */}
        {article.content?.blocks && (
          <div className="mt-8 article-body">
            <BlockRenderer blocks={article.content.blocks} />
          </div>
        )}

        {/* Tag Pill List */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex-start gap-2 flex-wrap">
            {article.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-[12px] font-exo py-1 px-2 border border-accent rounded-sm bg-stone-50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Static Centralized Action Row */}
        <div className="border-t border-b border-muted p-3 mt-8 flex-between">
          <button
            onClick={likeArticle}
            className="flex-start gap-1 cursor-pointer group bg-transparent border-0"
          >
            {liked ? (
              <GoHeartFill className="text-red-500" size={19} />
            ) : (
              <GoHeart className="text-stone-400 group-hover:text-red-400 transition" size={19} />
            )}
            <span className="text-sm text-stone-600">
              {(article.likes || 0) + likeCountOffset}
            </span>
          </button>

          <button onClick={shareArticle} className="cursor-pointer bg-transparent border-0">
            <CgShare className="text-stone-400 hover:text-stone-600 transition" size={19} />
          </button>
        </div>

        {/* Extended Bio Profile Card */}
        <footer className="mt-16 bg-stone-50/50 p-6 rounded-xl border border-stone-100">
          <H3 font="exo" text="About The Author" others="mb-4" />
          
          <div className="block sm:flex items-start gap-4">
            <a href={article.authorProfileUrl} className="block h-16 w-16 min-w-16 rounded-full overflow-hidden mb-3 sm:mb-0">
              {article.authorPicture ? (
                <img
                  src={article.authorPicture}
                  alt={article.authorFullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </a>
            
            <div className="grow">
              <div className="flex-start gap-2">
                <H2 font="inter" text={article.authorFullname} others="text-lg" />
                {article.authorVerified && (
                  <MdVerified size={18} color="rgba(93, 110, 189, 1)" />
                )}
              </div>
              <p className="text-accent font-outfit mt-1 text-sm leading-relaxed">
                {article.authorBio || "No bio details shared by this author yet."}
              </p>
            </div>
          </div>

          {!isProfileOwner && (
            <button
              onClick={toggleFollow}
              className="btn-primary text-sm rounded-full px-5 py-2 mt-4"
            >
              {isFollowing ? "Unfollow Author" : "Follow Author"}
            </button>
          )}
        </footer>

        {/* Dynamic Comment Flow Engine Container */}
        <section className="mt-16">
          <div className="flex-between mb-6">
            <H3 font="exo" text={`Comments (${comments.length})`} />
            
            {sendingComment ? (
              <button className="py-2 px-4 bg-gray-200 cursor-not-allowed rounded-md">
                <Spinner size={16} color="gray" />
              </button>
            ) : (
              <button
                onClick={handleCommentAction}
                className="btn-primary text-sm py-2 px-4 rounded-full"
                disabled={commentBarActive && !commentValue.trim()}
              >
                {commentBarActive ? "Send" : "Add Comment"}
              </button>
            )}
          </div>

          {commentBarActive && (
            <div className="mt-4 mb-6 animate-fadeIn">
              <textarea
                rows={4}
                placeholder="Share your thoughts on this story..."
                className="resize-none border border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-sans text-sm focus:ring-1 focus:ring-accent"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
            </div>
          )}

          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <NotFound
                img="b"
                text="No Comments Yet"
                subText="Be the first to comment on this post."
              />
            ) : (
              comments.map((item: Comment) => (
                <CommentDisplay
                  key={item.commentId}
                  comment={item}
                  setRegisterModal={setRegisterModal}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ArticlePage;