"use client";

import { useSelector } from "react-redux";
import ArticleDisplay from "./article-display";
import { useFetchFyp } from "@/src/hooks/useFetchFyp";
import type { Post } from "@/src/types/article";
import type { RootState } from "@/src/redux/store";
import Spinner from "./spinner";
import NotFound from "./not-found";
import FeaturedArticleDisplay from "./featured-article-display";

const FYPSection = () => {
  const { isLoading, isError } = useFetchFyp();
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
          darkThemeStyle={true}
        />
      </div>
    );

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1)

  return (
    <section className="mb-10">
      <FeaturedArticleDisplay article={featuredArticle} />

      {otherArticles.map((article, i) => (
        <ArticleDisplay key={i} article={article} darkThemeStyle={true} />
      ))}
    </section>
  );
};

export default FYPSection;
