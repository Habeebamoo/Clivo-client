import { MdCancel, MdVerified } from "react-icons/md"
import type { Comment } from "../pages/index/Article"
import { useEffect, useState } from "react"
import Spinner from "./Spinner"

interface Props {
  commentId: string,
  repliedTo: string,
  setReplysBox: React.Dispatch<React.SetStateAction<boolean>>
}

const ReplyBox = ({ commentId, repliedTo, setReplysBox }: Props) => {
  const [replys, setReplys] = useState<Comment[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchReplys = async () => {
      setLoading(true)

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}/replys`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY
          }
        })

        const response = await res.json()

        if (!res.ok) {
          throw new Error(response.message)
          return
        }

        setReplys(response.data)
      } catch (error) {
        throw new Error("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchReplys()
  }, [])

  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-black/80 z-20 md:flex-center">
      <div className="bg-white md:rounded-xl w-[500px] p-6 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-[95%] max-md:rounded-t-xl mx-auto">
        {/* cacel button */}
        <div 
          onClick={() => setReplysBox(false)} 
          className="flex-end cursor-pointer"
        >
          <MdCancel size={18} />
        </div>

        {/* heading */}
        <h1 className="font-outfit text-accent">Replying to <span className="text-black">{repliedTo}</span></h1>

        {/* replys */}
        {loading ? 
          <div className="flex-center my-20">
            <Spinner color="white" size={16} />
          </div>
        :
          <div className="mt-10">
            {replys.map((reply: Comment) => {
              return (
                <div className="mb-8">
                  <div className="flex-start gap-3">
                    <img src={reply.picture} className="h-7 w-7 rounded-full" />
                    <div className="flex-start gap-1 text-sm font-inter">
                      <p>{reply.name}</p>
                      {reply.verified && <MdVerified size={16} color="rgba(93, 110, 189, 1)" />}
                    </div>
                  </div>
                  <p className="pl-10 text-sm font-open mt-1">{reply.content}</p>
                </div>
              )
            })}
          </div> 
        }

      </div>
    </section>
  )
}

export default ReplyBox