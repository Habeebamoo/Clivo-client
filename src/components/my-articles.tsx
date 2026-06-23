"use client";

import { useSelector } from "react-redux";
import { useFetchArticles } from "@/src/hooks/useFetchArticles";
import type { Article } from "@/src/types/article";
import type { RootState } from "@/src/redux/store";
import Spinner from "./spinner";
import NotFound from "./not-found";
import ProfileArticleDisplay from "./profile-article-display";

const MyArticles = () => {
  const articles: Article[] = useSelector(
    (state: RootState) => state.articles.articles
  );
  const { isLoading, isError } = useFetchArticles();

  if (isLoading)
    return (
      <div className="flex-center h-50">
        <Spinner color="accentLight" size={20} />
      </div>
    );

  if (isError)
    return (
      <div className="mb-20">
        <NotFound
          img="b"
          text="An Error Occurred"
          subText="An unexpected error has occurred"
          darkThemeStyle={true}
        />
      </div>
    );

  return (
    <>
      {articles.length === 0 ? (
        <div className="flex-center flex-col mb-20 lg:mt-10">
          <img src="/avatar.png" />
          <h1 className="font-inter text-xl md:text-2xl mt-6 text-center text-stone-900 dark:text-stone-300">
            This user hasn't posted anything!
          </h1>
        </div>
      ) : (
        <div>
          {articles.map((article: Article) => (
            <ProfileArticleDisplay
              key={article.articleId}
              article={article}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MyArticles;