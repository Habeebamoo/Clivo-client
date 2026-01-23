import { useSelector } from "react-redux";
import { useFetchArticles } from "../hooks/useFetchArticles";
import type { Article } from "../redux/reducers/article_reducer";
import avatar from "../assets/avatar.jpg"
import ArticleDisplay from "./ArticleDisplay";
import { H2 } from "./Typo";
import Spinner from "./Spinner";
import NotFound from "./NotFound";

const MyArticles = () => {
  const myArticles: Article[] = useSelector((state: any) => state.articles.articles);
  const { isLoading, isError } = useFetchArticles();

  if (isLoading) return (
    <div className="flex-center h-50">
      <Spinner color="accentLight" size={20} />
    </div>
  )

  if (isError) {
    return (
      <div className="mb-20">
        <NotFound img="b" text="An Error Occurred" subText="An unexpected error has occurred" />
      </div>
    )
  }

  return (
    <>
      {myArticles.length == 0 ? 
      (
        <div className="flex-center flex-col mb-20 lg:mt-10">
          <img src={avatar} className="h-70" />
          <H2 font="inter" text="This user hasn't posted anything!" others="mt-6 text-center" />
        </div>
      ) : (
        <div>
          {myArticles.map((article: Article) => {
            return <ArticleDisplay key={article.articleId} article={article} />
          })}
        </div>
      )}
    </>
  )
}

export default MyArticles
