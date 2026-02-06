import { useSelector } from "react-redux"
import type { User } from "../redux/reducers/user_reducer";
import { FaX } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";

interface PropsType {
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UserModal = ({ setModalActive }: PropsType) => {
  const user: User = useSelector((state: any) => state.admin.user);

  const closeModal = () => {
    setModalActive(false)
  }

  return (
    <section className="bg-black/50 z-30 fixed top-0 bottom-0 left-0 right-0 flex-center">
      <div className="bg-white w-[90%] sm:w-200 p-4 border border-muted">
        <div onClick={closeModal} className="flex-end mb-2 cursor-pointer">
          <FaX color="red" size={15} />
        </div>

        {/* user info */}
        <div className="flex-start gap-3">
          {/* Picture */}
          <div className="h-10 w-10 bg-muted border border-accentLight rounded-full"></div>

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
          <button className="bg-blue-600 border border-blue-600 cursor-pointer hover:bg-transparent hover:text-blue-600 py-2 px-3 text-sm font-inter text-white rounded-md block mb-2">
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