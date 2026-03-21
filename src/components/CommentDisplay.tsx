import { useSelector } from "react-redux";
import { useFetchProfile } from "../hooks/useFetchProfile";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { User } from "../redux/reducers/user_reducer";
import { toast } from "react-toastify";
import ReplyBox from "./ReplysBox";
import { MdVerified } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { PiArrowBendDoubleUpLeftBold } from "react-icons/pi";
import Spinner from "./Spinner";

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

interface Props {
  comment: Comment, 
  setRegisterModal: Dispatch<SetStateAction<boolean>>
}

const CommentDisplay = ({ comment, setRegisterModal }: Props) => {
  const {} = useFetchProfile();
  const user: User = useSelector((state: any) => state.user.profile);
  const [replybarActive, setReplyBarActive] = useState<boolean>(false)
  const [replysBox, setReplysBox] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const sendReply = async () => {
    if (!user.userId) {
      setRegisterModal(true)
      return
    }

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
        if (res.status === 401) {
          toast.error("You need to be logged in to reply")
          return
        }

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
    <div className="border-t border-muted py-4">
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
            className="p-3 border border-gray-300 resize-none rounded-xl focus:outline-none font-open"
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
};

export default CommentDisplay;
