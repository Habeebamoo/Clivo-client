import { FaX } from "react-icons/fa6"
import type { Appeal } from "../redux/reducers/admin_reducer"
import { useSelector } from "react-redux"

interface PropsType {
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AppealModal = ({ setModalActive }: PropsType) => {
  const userAppeal: Appeal = useSelector((state: any) => state.admin.appeal);

  const closeModal = () => {
    setModalActive(false)
  }

  return (
    <section className="bg-black/50 z-30 fixed top-0 bottom-0 left-0 right-0 flex-center">
      <div className="bg-white w-[90%] sm:w-[400px] p-4 border-1 border-muted">
        <div onClick={closeModal} className="flex-end mb-2 cursor-pointer">
          <FaX color="red" size={15} />
        </div>

        {/* user info */}
        <div className="flex-start gap-3">
          {/* Picture */}
          <div className="h-10 w-10 bg-muted border-1 border-accentLight rounded-full"></div>

          <div>
            <p className="font-inter">{userAppeal.userFullname}</p>
            <p className="font-inter text-accentLight text-sm">{userAppeal.username}</p>
          </div>
        </div>

        {/* appeal message */}
        <div className="mt-6">
          <p className="font-inter">Appeal Message</p>
          <p className="font-exo text-accent mt-2 text-sm">{userAppeal.appealMessage}</p>
        </div>

        {/* actions */}
        <div className="mt-6 flex-start gap-2">
          <button className="bg-green-600 border-1 border-green-600 cursor-pointer hover:bg-transparent hover:text-green-600 py-2 px-3 text-sm font-inter text-white rounded-md">
            Accept
          </button>

          <button className="bg-red-600 border-1 border-red-600 cursor-pointer hover:bg-transparent hover:text-red-600 py-2 px-3 text-sm font-inter text-white rounded-md">
            Reject
          </button>
        </div>
      </div>
    </section>
  )
}

export default AppealModal