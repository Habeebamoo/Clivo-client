import { useSelector } from "react-redux"
import type { User } from "../redux/reducers/user_reducer";
import { FaX } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";

interface PropsType {
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UserModal = ({ setModalActive }: PropsType) => {
  const user: User = useSelector((state: any) => state.admin.user);

  const closeModal = () => {
    setModalActive(false)
  }

  const toggleVerififiedUser = async () => {
    const path = user.verified ? "unverify" : "verify";

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/${path}/${user.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      })

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setTimeout(() => {
        setModalActive(false)
        window.location.reload();
        
      }, 2500)
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <section className="bg-black/50 z-30 fixed top-0 bottom-0 left-0 right-0 flex-center">
      <div className="bg-white w-[90%] sm:w-100 p-4 border border-muted">
        <div onClick={closeModal} className="flex-end mb-2 cursor-pointer">
          <FaX color="red" size={15} />
        </div>

        {/* user info */}
        <div className="flex-start gap-3">
          {/* Picture */}
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img src={user.picture} className="h-full w-full" />
          </div>

          <div>
            <div className="flex-start gap-1">
              <p className="font-inter">{user.name}</p>
              {user.verified && <MdVerified color="rgba(93, 110, 189, 1)" />}
            </div>
            <p className="font-inter text-accentLight text-sm">{user.username}</p>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6">
          <button
            onClick={toggleVerififiedUser} 
            className="bg-blue-600 border border-blue-600 cursor-pointer hover:bg-transparent hover:text-blue-600 py-2 px-3 text-sm font-inter text-white rounded-md block mb-2"
          >
            {user.verified ? "Un-verify User" : "Verify User"}
          </button>

          <button className="btn-primary font-inter py-2 text-sm rounded-md block">
            Ban User
          </button>
        </div>
      </div>
    </section>
  )
}

export default UserModal