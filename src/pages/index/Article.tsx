import { H2, H3 } from "../../components/Typo"
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { type Post } from "../../redux/reducers/article_reducer";
import { shorten } from "../../utils/utils";
import { FaUpload } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CgShare } from "react-icons/cg";
import NotFound from "../../components/NotFound";
import Loading from "../../components/Loading";
import { useFetchUserArticle } from "../../hooks/useFetchUserArticle";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { User } from "../../redux/reducers/user_reducer";
import Spinner from "../../components/Spinner";
import { useFetchProfile } from "../../hooks/useFetchProfile";
import BlockRenderer from "../../components/BlockRenderer";
import RegisterModal from "../../components/RegisterModal";
import CommentDisplay, { type Comment } from "../../components/CommentDisplay";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [registerModal, setRegisterModal] = useState<boolean>(false);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const isProfileOwner = user.username === username;

  const navigate = useNavigate();
  if (!username || !title) {
    navigate("/")
  }

  useEffect(() => {
    if (!user.userId) {
      return
    }

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/follow-status/${user.userId}/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY 
          }
        })

        const response = await res.json()

        if (!response.success) {
          console.error("failed to get follow status")
          return
        }

        setIsFollowing(response.data.status)
        console.log(response.data)
        
      } catch (error) {
        console.error("failed to get follow status")
      }
    }

    fetchFollowStatus();

  }, [user.userId])
  

  useEffect(() => {
    if (commentValue) {
      setCommentAction("send")
    }
  }, [commentValue])

  // actions
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
        if (res.status === 401) {
          setRegisterModal(true)
          return
        }

        toast.error(response.message)
        return
      }

      toast.success(response.message)
      window.location.reload()
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
        if (res.status === 401) {
          setRegisterModal(true)
          return
        }

        toast.error("Failed to like post, Try again")
        return
      }

      window.location.reload()
    } catch (error) {
      toast.error("Failed to like post, Try again")
    }
  }

  const toggleFollow = async () => {
    if (!user.userId) {
      setRegisterModal(true)
      return
    }
    
    setIsFollowing(!isFollowing)

    if (isProfileOwner) {
      toast.error("You can't follow yourself")
      setLoading(false)
      return
    }

    const path = isFollowing ? "unfollow" : "follow";

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${path}/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)

    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const followBtnText = isFollowing ? "Unfollow" : "Follow";

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
    <main className="w-[90%] sm:w-100 md:w-125 mx-auto">
      {registerModal && <RegisterModal />}

      {/* Heading section */}
      <div className="p-1 w-full mt-6">
        <div>
          {article!.picture ? (
            <img src={article!.picture} className="h-full w-full object-cover object-center mb-4 mx-auto" />
          ) : (
            <div className="bg-muted w-full grow h-35 mb-4"></div>
          )}
        </div>
        <H2 font="exo" text={shorten(article!.title, 50)} others="text-center mt-10" />
      </div>

      {/* Author */}
      <div className="text-[12px] text-accentLight font-outfit flex-start gap-3 mt-8">
        <p>{article!.readTime} read time</p>
        <div className="bg-accentLight h-1 w-1 rounded-full"></div>
        <p>{article!.createdAt}</p>
      </div>

      <div className="flex-start gap-3 mt-2">
        <div onClick={toUser} className="h-7 w-7 rounded-full overflow-hidden cursor-pointer">
          {article!.authorPicture ? (
            <img src={article!.authorPicture} className="h-full w-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-muted border border-accentLight"></div>
          )}
        </div>

        <div onClick={toUser} className="flex-start gap-1 cursor-pointer">
          <Link to={`${article?.authorProfileUrl!}`}>
            {article!.authorFullname}
          </Link>

          {article!.authorVerified && 
            <MdVerified color="rgba(93, 110, 189, 1)" />
          }
        </div>

        <div className="flex-start gap-1 ml-4">
          {!isProfileOwner && 
            <button
              onClick={toggleFollow} 
              className="btn-primary text-[12px] rounded-full font-inter"
            >
              {followBtnText}
            </button>
          }

          <button 
            onClick={copyArticleSlug}
            className="text-[12px] flex-center gap-1 border border-accent py-1 px-3 rounded-full cursor-pointer text-black hover:bg-muted active:bg-muted"
          >
          <FaUpload />
          <span>Share</span>
        </button>
        </div>
      </div>
      <hr className="text-muted mt-6 mb-4" />

      {/* Article Content */}
      <div className="mt-8">
        <BlockRenderer blocks={article?.content.blocks} />
      </div>

      {/* tags */}
      <div className="mt-10 flex-start gap-2 flex-wrap">
        {article!.tags?.map((tag: string, i: any) => {
          return <div key={i} className="text-[12px] font-exo py-1 px-2 border border-accent rounded-sm">{tag}</div>
        })}
      </div>

      {/* Info's */}
      <div className="border-t border-b border-muted p-3 mt-8 flex-between">
        <div 
          onClick={likeArticle}  
          className="flex-start gap-1 cursor-pointer"
        >
          {article!.likes > 0 ? 
            <GoHeartFill color="rgb(165, 163, 161)" size={19} /> 
          : 
            <GoHeart color="rgb(165, 163, 161)" size={19} />
          }
          
          <p className="text-sm">{article?.likes}</p>
        </div>

        <div onClick={copyArticleSlug} className="cursor-pointer">
          <CgShare color="rgb(165, 163, 161)" size={19} />
        </div>
      </div>

      {/* Profile */}
      <div className="mt-15">
        <H3 font="exo" text="About The Author." />
        
        <a href={`${article?.authorProfileUrl!}`}>
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
            <p className="text-accent font-outfit mt-2 text-sm">{article?.authorBio}</p>
          </div>
        </a>

        {!isProfileOwner && 
          <button
            onClick={toggleFollow} 
            className="btn-primary rounded-full px-4 py-2 mt-4"
          >
            {followBtnText}
          </button>
        }
      </div>

      {/* Comments */}
      <div className="mt-20 mb-25">
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
              className="resize-none border border-accentLight rounded-lg focus:outline-none w-full py-2 px-3 font-jsans"
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
                return <CommentDisplay comment={comment} setRegisterModal={setRegisterModal} />
              })}
            </div>
          }
        </div>
      </div>

    </main>
  )
}


export default ArticlePage