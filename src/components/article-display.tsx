"use client";

import { H3 } from "./typo";
import { shorten } from "@/src/utils/helpers";
import type { Article, Post } from "@/src/types/article";
import { MdVerified } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import Link from "next/link";

const ArticleDisplay = ({ article }: { article: Post | Article }) => {
  const toUser = () => {
    window.location.href = article.authorProfileUrl;
  };

  return (
    <div className="py-4 border-b border-b-muted">
      <div
        onClick={toUser}
        className="cursor-pointer p-1 hover:bg-gray-50 active:bg-gray-50"
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
            <div className="w-7 h-7 rounded-full bg-muted border border-accentLight" />
          )}
          <div className="pt-3">
            <div className="flex-start gap-1">
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/${article.slug}`}
                className="font-inter text-sm"
              >
                {article.authorFullname}
              </Link>
              {article.authorVerified && (
                <MdVerified color="rgba(93, 110, 189, 1)" />
              )}
            </div>
            <p className="text-[12px] text-accent font-outfit">
              {article.createdAt}
            </p>
          </div>
        </div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/${article.slug}`}>
        <div className="py-3 my-2 grid grid-cols-6 gap-3 px-1 hover:bg-gray-50 active:bg-gray-50 cursor-pointer">
          <div className="col-span-4 break-words">
            <H3 font="inter" text={shorten(article.title, 50)} />
          </div>
          <div className="h-20 w-full col-span-2">
            {article.picture ? (
              <img
                src={article.picture}
                className="h-full w-full object-cover"
                alt={article.title}
              />
            ) : (
              <div className="w-full h-full bg-muted object-cover" />
            )}
          </div>
        </div>
      </a>

      <div className="px-1 flex-start flex-wrap gap-1 w-[80%]">
        {article.tags?.map((tag: string, i: number) => (
          <div
            key={i}
            className="text-[12px] font-exo py-1 px-2 border border-accent rounded-sm"
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="mt-4 px-2 flex-between">
        <div className="flex-start gap-1">
          {article.likes > 0 ? (
            <GoHeartFill color="rgb(165, 163, 161)" size={19} />
          ) : (
            <GoHeart color="rgb(165, 163, 161)" size={19} />
          )}
          <p className="text-[12px] font-outfit">{article.likes}</p>
        </div>
        <p className="text-[12px] font-outfit text-accentLight">
          {article.readTime} read time
        </p>
      </div>
    </div>
  );
};

export default ArticleDisplay;
