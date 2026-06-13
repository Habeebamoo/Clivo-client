"use client";

import { useSelector } from "react-redux";
import ArticleDisplay from "./article-display";
import type { Post } from "@/src/types/article";
import type { RootState } from "@/src/redux/store";
import Spinner from "./spinner";
import { useFetchFeed } from "@/src/hooks/useFetchFeed";
import NotFound from "./not-found";

const FeedSection = () => {
  const { isLoading, isError } = useFetchFeed();
  const articles: Post[] = useSelector(
    (state: RootState) => state.articles.posts
  );

  if (isLoading)
    return (
      <div className="flex-center h-50">
        <Spinner color="accentLight" size={20} />
      </div>
    );

  if (isError)
    return (
      <div className="mb-20">
        <NotFound img="b" text="We're Sorry" subText="An unknown error occurred" />
      </div>
    );

  if (articles.length === 0)
    return (
      <div className="mb-20">
        <NotFound
          img="b"
          text="Couldn't Load Articles"
          subText="No articles were found here."
        />
      </div>
    );

  return (
    <section className="mb-10">
      {articles.map((article, i) => (
        <ArticleDisplay key={i} article={article} />
      ))}
    </section>
  );
};

export default FeedSection;
