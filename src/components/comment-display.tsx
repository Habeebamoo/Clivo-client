"use client";

import { useSelector } from "react-redux";
import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { User } from "@/src/types/user";
import type { Comment } from "@/src/types/comment";
import type { RootState } from "@/src/redux/store";
import { toast } from "react-toastify";
import ReplyBox from "./replys-box";
import { MdVerified } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { PiArrowBendDoubleUpLeftBold } from "react-icons/pi";
import Spinner from "./spinner";

interface Props {
  comment: Comment;
  setRegisterModal: Dispatch<SetStateAction<boolean>>;
}

const CommentDisplay = ({ comment, setRegisterModal }: Props) => {
  useFetchProfile();
  const user: User = useSelector((state: RootState) => state.user.profile as User);

  const [replybarActive, setReplyBarActive] = useState(false);
  const [replysBox, setReplysBox] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReply = async () => {
    if (!user.userId) {
      setRegisterModal(true);
      return;
    }
    if (!content) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/comment/${comment.commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            commentId: comment.commentId,
            articleId: comment.articleId,
            userId: user.userId,
            content,
          }),
          credentials: "include",
        }
      );

      const response = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("You need to be logged in to reply");
          return;
        }
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setReplyBarActive(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-muted py-4">
      {replysBox && (
        <ReplyBox
          commentId={comment.commentId}
          repliedTo={comment.username}
          setReplysBox={setReplysBox}
        />
      )}

      <div className="flex-start gap-3">
        <img
          src={comment.picture}
          className="h-7 w-7 rounded-full"
          alt={comment.name}
        />
        <div className="flex-start gap-1">
          <p className="font-inter text-sm">{comment.name}</p>
          {comment.verified && <MdVerified color="rgba(93, 110, 189, 1)" />}
        </div>
      </div>

      <div className="pl-10 text-sm font-open break-words mt-1">
        {comment.content}
      </div>

      <div className="flex-between mt-3 text-gray-600 px-4">
        <div
          onClick={() => setReplysBox(true)}
          className="font-inter text-[12px] flex-start gap-2 cursor-pointer"
        >
          <FaRegEye />
          <span>{comment.replys} replys</span>
        </div>
        <p
          onClick={() => setReplyBarActive(true)}
          className="cursor-pointer flex-center text-[12px] font-inter gap-2"
        >
          <PiArrowBendDoubleUpLeftBold />
          <span>Reply</span>
        </p>
      </div>

      {replybarActive && (
        <div className="flex-end mt-2">
          <textarea
            rows={2}
            className="p-3 border border-gray-300 resize-none rounded-xl focus:outline-none font-open"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      )}
      {replybarActive && (
        <div className="flex-end mt-2">
          {loading ? (
            <button className="py-2 px-4 bg-gray-200 rounded-md cursor-not-allowed text-white">
              <Spinner size={16} color="white" />
            </button>
          ) : (
            <button onClick={sendReply} className="btn-primary text-sm">
              Send
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentDisplay;
