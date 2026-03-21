import { motion } from "framer-motion"
import { slideDown } from "../utils/animation"
import { useState } from "react"
import { toast } from "react-toastify"
import { MdCancel } from "react-icons/md"
import Spinner from "./Spinner"

const DeleteModal = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const deleteArticle = async () => {
    setLoading(true)
    if (text !== "delete") {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      });

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setTimeout(() => window.location.reload(), 5000)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/70  z-30 flex-center">
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={slideDown} 
        className="bg-white rounded-lg px-6 py-8 w-[90%] sm:w-100"
      >
        <div className="flex-center">
          <MdCancel size={40} color="red" />
        </div>

        <h1 className="font-outfit text-center mt-2 text-xl md:text-2xl">Delete Article</h1>

        <p className="font-jsl text-sm text-gray-700 mt-4 text-center">
          You are aware that this action cannot be reversed and all data will be lost
        </p>

        <p className="font-jsl text-sm text-gray-700 mt-2 text-center">
          To confirm you actually want to delete this article, type <span className="text-red-600 font-inter font-bold">delete</span> in the box below
        </p>

        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-inter p-2 border bg-gray-100 border-gray-200 w-full rounded-lg focus:outline-none mt-6 mb-4" 
        />

        {loading ? 
          <button
            className="bg-red-100 cursor-not-allowed flex-center py-4 rounded-lg w-full"
          >
            <Spinner color="white" size={18} />
          </button> 
        : 
          <button
            onClick={deleteArticle}
            className="py-3 w-full cursor-pointer bg-red-500 text-white font-outfit rounded-lg hover:bg-red-400 active:bg-red-400"
          >
            Delete
          </button>
        }
      </motion.div>
    </div>
  )
}

export default DeleteModal