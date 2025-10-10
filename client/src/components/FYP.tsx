import { useSelector } from "react-redux"
import ArticleDisplay from "../components/ArticleDisplay"
import { useFetchFyp } from "../hooks/useFetchFyp"
import type { Post } from "../redux/reducers/article_reducer"
import Spinner from "./Spinner"

const FYPSection = () => {
  const { isLoading, isError } = useFetchFyp()
  const articles: Post[] = useSelector((state: any) => state.articles.posts)

  if (isLoading) return (
    <div className="flex-center h-[200px]">
      <Spinner color="accentLight" size={20} />
    </div>
  )

  if (isError) return <p>error</p>

  return (
    <>
      {articles!.map((article: any, i: any) => {
        return (
          <ArticleDisplay key={i} article={article} />
        )
      })}
    </>
  )
}

export default FYPSection