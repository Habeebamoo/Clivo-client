"use client";

import { H3 } from "./typo";
import { shorten } from "@/src/utils/helpers";
import type { Article, Post } from "@/src/types/article";
import { MdVerified } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import Link from "next/link";
import { FaTrashCan } from "react-icons/fa6";
import { useState } from "react";
import DeleteModal from "./delete-modal";

const ProfileArticleDisplay = ({ article }: { article: Post | Article }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const toUser = () => {
    window.location.href = article.authorProfileUrl;
  };

  return (
    <div className="py-4 border-b border-b-muted dark:border-b-stone-800">
      {deleteModal && <DeleteModal id={article.articleId} />}

      <div
        onClick={toUser}
        className="cursor-pointer p-1 hover:bg-gray-50 dark:hover:bg-stone-900/40 active:bg-gray-50 dark:active:bg-stone-900/40"
      >
        <div className="flex-start gap-3">
          {article.authorPicture ? (
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                src={article.authorPicture}
                className="h-full w-full object-cover"
                alt={article.authorFullname}
              />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-muted dark:bg-stone-800 border border-accentLight dark:border-stone-700" />
          )}
          <div className="pt-3">
            <div className="flex-start gap-1">
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/${article.slug}`}
                className="font-inter text-sm text-stone-900 dark:text-stone-100"
              >
                {article.authorFullname}
              </Link>
              {article.authorVerified && (
                <MdVerified color="rgba(93, 110, 189, 1)" />
              )}
            </div>
            <p className="text-[12px] text-accent dark:text-stone-400 font-outfit">
              {article.createdAt}
            </p>
          </div>
        </div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/${article.slug}`}>
        <div className="py-3 my-2 grid grid-cols-6 gap-3 px-1 hover:bg-gray-50 dark:hover:bg-stone-900/40 active:bg-gray-50 dark:active:bg-stone-900/40 cursor-pointer">
          <div className="col-span-4 wrap-break-word text-stone-900 dark:text-stone-300">
            <h3 className="font-inter text-xl">{shorten(article.title, 50)}</h3>
          </div>
          <div className="h-20 w-full col-span-2">
            {article.picture ? (
              <img
                src={article.picture}
                className="h-full w-full object-cover rounded-sm"
                alt={article.title}
              />
            ) : (
              <div className="w-full h-full bg-muted dark:bg-stone-800 rounded-sm" />
            )}
          </div>
        </div>
      </a>

      <div className="px-1 flex-start flex-wrap gap-1 w-[80%]">
        {article.tags?.map((tag: string, i: number) => (
          <div
            key={i}
            className="text-[12px] font-exo py-1 px-2 border border-accent dark:border-stone-700 rounded-sm text-stone-800 dark:text-stone-300"
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="mt-4 px-2 flex-between">
        <div className="flex-start gap-1 text-stone-700 dark:text-stone-300">
          {article.likes > 0 ? (
            <GoHeartFill color="rgb(165, 163, 161)" size={19} />
          ) : (
            <GoHeart color="rgb(165, 163, 161)" size={19} />
          )}
          <p className="text-[12px] font-outfit">{article.likes}</p>
        </div>
        <p className="text-[12px] font-outfit text-accentLight dark:text-stone-300">
          {article.readTime} read time
        </p>
      </div>

      <div className="mt-4 px-2 flex-end">
        <FaTrashCan
          onClick={() => setDeleteModal(true)}
          className="text-red-400 hover:text-red-200 dark:hover:text-red-300 active:text-red-200 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ProfileArticleDisplay;