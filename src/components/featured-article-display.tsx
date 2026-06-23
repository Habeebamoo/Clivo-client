"use client";

import { shorten } from "@/src/utils/helpers";
import type { Article, Post } from "@/src/types/article";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";

interface FeaturedArticleProps {
  article: Post | Article & { description?: string }; // Fallback field for the snippet text
}

const FeaturedArticleDisplay = ({ article }: { article: any }) => {
  const articleLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${article.slug}`;

  return (
    <div className="py-6 flex flex-col gap-3 max-w-2xl border-b border-b-muted dark:border-stone-800">
      {/* Featured Main Image */}
      <Link href={articleLink} className="block w-full overflow-hidden rounded-xl mb-2">
        {article.picture ? (
          <img
            src={article.picture}
            className="w-full h-auto max-h-105 object-cover hover:scale-[1.01] transition-transform duration-300"
            alt={article.title}
          />
        ) : (
          <div className="w-full h-70 bg-muted dark:bg-stone-800 rounded-xl" />
        )}
      </Link>

      {/* Author & Date Metadata Row */}
      <div className="flex items-center gap-1.5 text-sm font-outfit text-stone-600 dark:text-stone-400">
        <span className="font-medium">{article.authorFullname}</span>
        <span>•</span>
        <span>{article.createdAt}</span>
      </div>

      {/* Title with Action Link & Arrow Icon */}
      <Link href={articleLink} className="group block">
        <div className="flex justify-between items-start gap-4">
          <h2 className="font-inter text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-accentLight dark:group-hover:text-accent transition-colors duration-200">
            {article.title}
          </h2>
          <FiArrowUpRight 
            size={28} 
            className="text-stone-800 dark:text-stone-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" 
          />
        </div>
      </Link>

      {/* Description Excerpt Snippet */}
      <p className="font-inter text-stone-600 dark:text-stone-400 text-base leading-relaxed wrap-break-word">
        {shorten(article.description || article.subtitle || "", 160)}
      </p>

      {/* Read Time Context */}
      <p className="text-sm font-bold font-outfit text-stone-900 dark:text-stone-200">
        {article.readTime} read time
      </p>

      {/* Pill-Shaped Rounded Tags */}
      <div className="flex flex-wrap gap-2 mt-1">
        {article.tags?.map((tag: string, i: number) => (
          <div
            key={i}
            className="text-xs font-exo py-1.5 px-4.5 border border-stone-400 dark:border-stone-700 rounded-full text-stone-800 dark:text-stone-300 tracking-wide"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArticleDisplay;