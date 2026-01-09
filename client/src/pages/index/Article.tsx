import { H2, H3 } from "../../components/Typo"
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { type Post } from "../../redux/reducers/article_reducer";
import { shorten } from "../../utils/utils";
import { FaRegEye, FaUpload } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";
import { CgShare } from "react-icons/cg";
import NotFound from "../../components/NotFound";
import Loading from "../../components/Loading";
import { useFetchUserArticle } from "../../hooks/useFetchUserArticle";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { User } from "../../redux/reducers/user_reducer";
import Spinner from "../../components/Spinner";
import { useFetchProfile } from "../../hooks/useFetchProfile";
import { PiArrowBendDoubleUpLeftBold } from "react-icons/pi";
import ReplyBox from "../../components/ReplysBox";
import BlockRenderer from "../../components/BlockRenderer";

export interface Comment {
  commentId: string,
	articleId: string,
  replys: number
	content: string,
	name: string,
	username: string,
	verified: boolean,
	picture: string,
} 

const ArticlePage = () => {
  const { username, title } = useParams<{ username: string, title: string }>();
  const { data, isLoading, isError } = useFetchUserArticle(username!, title!);
  const {} = useFetchProfile();
  const user: User = useSelector((state: any) => state.user.profile);

  const article: Post | undefined | void = data?.article;
  const comments: Comment[] = data?.comments;

  const [commentAction, setCommentAction] = useState<"add" | "send">("add");
  const [commentBarActive, setCommentBarActive] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)

  // const [hasUserLiked, setHasUserLiked] = useState<boolean>(false)
  // const [isArticleLiked, setIsArticleLiked] = useState<boolean>(false)

  // useEffect(() => {
  //   const fetchHasUserLiked = async () => {
  //     const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article/${article?.articleId}/liked/${user.userId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-API-KEY": import.meta.env.VITE_API_KEY
  //       },
  //       credentials: "include"
  //     })

  //     const response = await res.json()
  //     console.log(response)

  //     if (response.data.liked) {
  //       setHasUserLiked(true)
  //     } else {
  //       setHasUserLiked(false)
  //     }
  //   }

  //   fetchHasUserLiked()
  // }, [])

  const navigate = useNavigate();
  if (!username || !title) {
    navigate("/")
  }

  useEffect(() => {
    if (commentValue) {
      setCommentAction("send")
    }
  }, [commentValue])

  const handleCommentAction = async () => {
    if (commentAction === "add") {
      setCommentBarActive(true)
      return
    }

    setLoading(true)

    const data = {
      articleId: article?.articleId,
      userId: user.userId,
      content: commentValue
    }

    console.log(user.userId)

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article/comment/${article?.articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(data),
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const likeArticle = async () => {
    const data = {
      articleId: article?.articleId,
      likerUserId: user.userId
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(data),
        credentials: "include"
      })

      if (!res.ok) {
        toast.error("Failed to like post, Try again")
        return
      }

      // setIsArticleLiked(true)
      // setHasUserLiked(true)
      window.location.reload()
    } catch (error) {
      toast.error("Failed to like post, Try again")
    }
  }

  const toUser = () => {
    window.location.href = `${article?.authorProfileUrl!}`
  }
  
  const copyArticleSlug = () => {
    navigator.clipboard.
      writeText(`${import.meta.env.VITE_BASE_URL}/${article?.slug}`).
      then(() => toast.success("URL Copied")).
      catch(err => toast.error("Failed to copy " + err))
  }

  if (isLoading) return <Loading />

  if (isError) return <NotFound text="Couldn't Find Article" subText="This article has either been deleted or moved to a new URL" />

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
      <div className="text-[12px] text-accentLight font-outfit flex-start gap-3 mt-4">
        <p>{article!.readTime} read time</p>
        <div className="bg-accentLight h-1 w-1 rounded-full"></div>
        <p>{article!.createdAt}</p>
      </div>

      <div className="flex-start gap-3 mt-2">
        <div onClick={toUser} className="h-7 w-7 rounded-full overflow-hidden cursor-pointer">
          {article!.authorPicture ? (
            <img src={article!.authorPicture} className="h-full w-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-muted border-1 border-accentLight"></div>
          )}
        </div>
        <div onClick={toUser} className="flex-start gap-1 cursor-pointer">
          <p>{article!.authorFullname}</p>
          {article!.authorVerified && 
            <MdVerified color="rgba(93, 110, 189, 1)" />
          }
        </div>
        <div className="flex-start gap-1 ml-4">
          <button className="btn-primary text-[12px] rounded-full font-inter">Follow</button>

          <button 
            onClick={copyArticleSlug}
            className="text-[12px] flex-center gap-1 border-1 border-accent py-1 px-3 rounded-full cursor-pointer text-black hover:bg-muted active:bg-muted"
          >
          <FaUpload />
          <span>Share</span>
        </button>
        </div>
      </div>
      <hr className="text-muted mt-6 mb-4" />

      {/* Article Content */}
      <div className="font-dm text-text">
        <BlockRenderer blocks={article?.content.blocks} />
      </div>

      {/* tags */}
      <div className="mt-10 flex-start gap-2 flex-wrap">
        {article!.tags?.map((tag: string, i: any) => {
          return <div key={i} className="text-[12px] font-exo py-1 px-2 border-1 border-accent rounded-sm">{tag}</div>
        })}
      </div>

      {/* Info's */}
      <div className="border-t-1 border-b-1 border-muted p-3 mt-8 flex-between">
        <div 
          onClick={likeArticle}  
          className="flex-start gap-1 cursor-pointer"
        >
          {/* {hasUserLiked ? (
            <GoHeartFill color="black" size={19} />
          ) : isArticleLiked ? (
            <GoHeartFill color="grey" size={19} /> // optional: show filled heart for others
          ) : (
            <GoHeart color="rgb(165, 163, 161)" size={19} />
          )} */}

          <GoHeartFill color="rgb(165, 163, 161)" size={19} />
          <p className="text-sm">{article?.likes}</p>
        </div>
        <div>
          <CgShare color="rgb(165, 163, 161)" size={19} />
        </div>
      </div>

      {/* Profile */}
      <div className="mt-10">
        <H3 font="exo" text="About The Author." />
        <div onClick={toUser} className="cursor-pointer mt-8">
          <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
            <img src={article?.authorPicture} className="w-full h-full object-cover object-center" />
          </div>
          <div className="flex-start gap-2">
            <H2 font="inter" text={`${article?.authorFullname}`} />
            {article!.authorVerified && 
              <MdVerified size={22} color="rgba(93, 110, 189, 1)" />
            }
          </div>
          <p className="text-accent font-inter mt-2 text-sm">{article?.authorBio}</p>
        </div>

        <button className="btn-primary rounded-full px-4 py-2 mt-4">Follow</button>
      </div>

      {/* Comments */}
      <div className="my-15">
        <div className="flex-between">
          <H3 font="exo" text="Comments" />
          {loading ?
            <button className="py-2 px-4 bg-gray-200 cursor-not-allowed rounded-md">
              <Spinner size={16} color="white" />
            </button>
          : 
            <button onClick={handleCommentAction} className="btn-primary text-sm">
              {commentAction == "add" ? "Add Comment" : "Send"}
            </button>       
          }
        </div>

        {commentBarActive &&
          <div className="mt-4">
            <textarea 
              name="bio" 
              rows={4} 
              className="resize-none border-1 border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-inter"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}>
            </textarea>
          </div>
        }

        <div>
          {comments.length == 0 && <NotFound img="b" text="No Comments Yet" subText="Be the first to comment on this post." />}
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
  const {} = useFetchProfile();
  const user: User = useSelector((state: any) => state.user.profile);
  const [replybarActive, setReplyBarActive] = useState<boolean>(false)
  const [replysBox, setReplysBox] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const sendReply = async () => {
    setLoading(true)

    if (!content) return

    const data = {
      commentId: comment.commentId,
      articleId: comment.articleId,
      userId: user.userId,
      content: content
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article/comment/${comment.commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(data),
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setReplyBarActive(false)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t-1 border-muted py-4">
      {replysBox && 
        <ReplyBox 
          commentId={comment.commentId} 
          repliedTo={comment.username} 
          setReplysBox={setReplysBox}
        />
      }
      <div className="flex-start gap-3">
        <img src={comment.picture} className="h-7 w-7 rounded-full" />
        <div className="flex-start gap-1">
          <p className="font-inter text-sm">{comment.name}</p>
          {comment.verified && <MdVerified color="rgba(93, 110, 189, 1)" />}
        </div>
      </div>

      <div className="pl-10 text-sm font-open">
        {comment.content}
      </div>

      <div className="flex-between mt-3 text-gray-600 px-4">
        <div 
          onClick={() => setReplysBox(true)}
          className="font-inter text-[12px] flex-start gap-2 cursor-pointer"
        >
          <FaRegEye />
          <span>
            {comment.replys} replys
          </span>
        </div>

        <p onClick={() => setReplyBarActive(true)} className="cursor-pointer flex-center text-[12px] font-inter gap-2">
          <PiArrowBendDoubleUpLeftBold />
          <span>
            Reply
          </span>
        </p>
      </div>

      {/* reply input */}
      <div className="flex-end mt-2">
        {replybarActive && 
          <textarea 
            rows={2}
            className="p-3 border-1 border-gray-300 resize-none rounded-xl focus:outline-none font-open"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        }
      </div>
      {replybarActive && 
        <div className="flex-end mt-2">
          {loading ?
            <button className="py-2 px-4 bg-gray-200 rounded-md cursor-not-allowed text-white">
              <Spinner size={16} color="white"  />
            </button>
          :    
            <button onClick={sendReply} className="btn-primary text-sm flex-end">Send</button>
          }
        </div>
      }

    </div>
  )
}

export default ArticlePage