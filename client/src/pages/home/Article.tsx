import { H2, H3 } from "../../components/Typo"
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { posts, type Post } from "../../redux/reducers/article_reducer";
import { shorten } from "../../utils/utils";
import { FaUpload } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { GoHeart } from "react-icons/go";
import { CgShare } from "react-icons/cg";
import logo from "../../assets/logo.jpg"
import NotFound from "../../components/NotFound";

interface Comment {
	articleId: string,
	content: string,
	name: string,
	username: string,
	verified: boolean,
	picture: string,
} 

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //default comments
  const comments: Comment[] = [
    {articleId: "dnfiff", content: "Good", name: "Paul", username: "@paul", verified: true, picture: logo},
    {articleId: "dnfiff", content: "Yes", name: "Micheal", username: "@paul", verified: false, picture: ""},
  ]

  useEffect(() => {
    if (!id) {
      navigate("/dashboard")
    }
  })

  const article: Post | undefined = posts.find((art) => art?.articleId === id)

  if (!article) return <NotFound text="Couldn't Find Article" />

  return (
    <main className="w-[90%] sm:w-[400px] md:w-[500px] mx-auto">
      {/* Heading section */}
      <div className="p-1 w-full mt-6">
        <div>
          {article!.picture ? (
            <img src={article!.picture} className="h-35 mb-4 mx-auto" />
          ) : (
            <div className="bg-muted w-full flex-grow h-35 mb-4"></div>
          )}
        </div>
        <H2 font="exo" text={shorten(article!.title, 50)} others="text-center" />
      </div>

      {/* Author */}
      <div className="text-[12px] text-accentLight flex-start gap-3 mt-4">
        <p>{article!.readTime}</p>
        <div className="bg-accentLight h-1 w-1 rounded-full"></div>
        <p>{article!.createdAt}</p>
      </div>
      <div className="flex-start gap-3 mt-2">
        <div className="h-7 w-7 rounded-full overflow-hidden">
          {article!.authorPicture ? (
            <img src={article!.authorPicture} className="h-full w-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-muted border-1 border-accentLight"></div>
          )}
        </div>
        <div className="flex-start gap-1">
          <p>{article!.authorFullname}</p>
          {article!.authorVerified && 
            <MdVerified color="rgba(93, 110, 189, 1)" />
          }
        </div>
        <div className="flex-start gap-1 ml-4">
          <button className="btn-primary text-[12px] rounded-full font-inter">Follow</button>

          <button className="text-[12px] flex-center gap-1 border-1 border-accent py-1 px-3 rounded-full cursor-pointer text-black hover:bg-muted active:bg-muted">
          <FaUpload />
          <span>Share</span>
        </button>
        </div>
      </div>
      <hr className="text-muted mt-6 mb-4" />

      {/* Article Content */}
      <div className="font-exo text-text">
        {article!.content}
      </div>

      {/* tags */}
      <div className="mt-10 flex-start gap-2 flex-wrap">
        {article!.tags?.map((tag: string, i: any) => {
          return <div key={i} className="text-[12px] font-exo py-1 px-2 border-1 border-accent rounded-sm">{tag}</div>
        })}
      </div>

      {/* Info's */}
      <div className="border-t-1 border-b-1 border-muted p-3 mt-8 flex-between">
        <div className="flex-start gap-1">
          <GoHeart color="rgb(165, 163, 161)" size={19} />
          <p className="text-sm">{article!.likes}</p>
        </div>
        <div>
          <CgShare color="rgb(165, 163, 161)" size={19} />
        </div>
      </div>

      {/* Comments */}
      <div className="mt-10 mb-15">
        <H3 font="exo" text="Comments" />
        <div>
          {comments.length == 0}
          {comments.length !== 0 && 
            <div className="mt-8">
              {comments.map((comment: Comment) => {
                return <CommentDisplay comment={comment} />
              })}
            </div>
          }
        </div>
      </div>

    </main>
  )
}

const CommentDisplay = ({ comment }: { comment: Comment}) => {
  return (
    <div className="border-t-1 border-muted py-4">
      <div className="flex-start gap-2">
        {comment.picture ? (
          <img src={comment.picture} className="h-6 w-6 rounded-full" />
        ): (
          <div className="h-5 w-5 rounded-full bg-muted border-1 border-accentLight"></div>
        )}
        <div className="flex-start gap-1">
          <p className="font-inter">{comment.name}</p>
          {comment.verified && <MdVerified color="rgba(93, 110, 189, 1)" />}
        </div>
      </div>
      <div className="pl-8 text-sm font-inter text-accent mt-1">
        {comment.content}
      </div>
    </div>
  )
}

export default ArticlePage