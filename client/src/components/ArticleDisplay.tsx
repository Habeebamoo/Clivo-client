import { H3 } from "./Typo"
import { shorten } from "../utils/utils"
import type { Post } from "../redux/reducers/article_reducer"
import { MdVerified } from "react-icons/md"
import { GoHeart } from "react-icons/go"

const ArticleDisplay = ({ article }: { article: Post }) => {
  const toUser = () => {
    window.location.href = article.authorProfileUrl;
  }

  const toPost = () => {
    window.location.href = article.slug;
  }

  return (
    <div className="py-4 border-b-1 border-b-muted">
      {/* profile */}
      <div onClick={toUser} className="hover:bg-mutedLight active:bg-mutedLight cursor-pointer p-1">
        <div className="flex-start gap-2">
          {article.authorPicture ?
            <div className="h-6 w-6 rounded-full overflow-hidden">
              <img src={article.authorPicture} className="h-full w-full object-cover" />
            </div> :
            <div className="w-5 h-5 rounded-full bg-muted border-1 border-accentLight"></div>
          }
          <div className="flex-start gap-1">
            <p className="font-exo text-sm">{article.authorFullname}</p>
            {article.authorVerified && <MdVerified color="rgba(93, 110, 189, 1)" />}
          </div>
        </div>
        <p className="text-[12px] text-accent font-outfit pl-7">{article.createdAt}</p>
      </div>

      {/* title & picture */}
      <div onClick={toPost} className="py-3 my-2 grid grid-cols-6 gap-3 px-1 hover:bg-mutedLight active:bg-mutedLight cursor-pointer">
        <div className="col-span-4 break-words">
          <H3 font="inter" text={shorten(article.title, 50)} />
        </div>
        <div className="h-[80px] w-full col-span-2">
          {article.picture ? (
            <img src={article.picture} className="h-full w-full object-cover" />
          ): (
            <div className="w-full h-full bg-muted object-cover"></div>
          )}
        </div>
      </div>

      {/* tags */}
      <div className="px-1 flex-start flex-wrap gap-1 w-[80%]">
        {article.tags?.map((tag: string, i: any) => {
          return <div key={i} className="text-[12px] font-exo py-1 px-2 border-1 border-accent rounded-sm">{tag}</div>
        })}
      </div>

      {/* others */}
      <div className="mt-3 px-2 flex-between">
        <div className="flex-start gap-1">
          <GoHeart color="rgb(165, 163, 161)" />
          <p className="text-[12px] font-outfit">{article.likes}</p>
        </div>
        <p className="text-[12px] font-outfit text-accentLight">{article.readTime}</p>
      </div>

    </div>
  )
}

export default ArticleDisplay