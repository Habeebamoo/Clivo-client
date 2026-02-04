import { useState } from "react"
import { H1, H2 } from "../../components/Typo"
import { BiShield } from "react-icons/bi"
import { FiUser, FiUserCheck, FiUsers, FiUserX } from "react-icons/fi"
import { PiWarningCircle } from "react-icons/pi"
import UsersTab from "../../components/UsersTab"
import AppealsTab from "../../components/AppealsTab"
import UserModal from "../../components/UserModal"
import AppealModal from "../../components/AppealModal"

const AdminPage = () => {
  const [tab, setTab] = useState<"users" | "appeals">("users")
  const [userModalActive, setUserModalActive] = useState<boolean>(false)
  const [appealModalActive, setAppealModalActive] = useState<boolean>(false)

  return (
    <main className="px-4">
      {/* modals */}
      {userModalActive && <UserModal setModalActive={setUserModalActive} />}
      {appealModalActive && <AppealModal setModalActive={setAppealModalActive} />}

      {/* page title */}
      <div className="flex-start gap-2 mt-19">
        <BiShield size={33} />
        <div className="mt-4">
          <H1 font="inter" text="Admin Panel" />
          <p className="text-accent text-sm font-exo ">Manage users, verifications and appeals</p>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* total users */}
        <div className="bg-mutedLight border border-muted p-6 rounded-lg">
          <div className="flex-between">
            <p className="font-inter text-[17px]">Total Users</p>
            <FiUsers size={20} />
          </div>
          <H2 font="inter" text="1,248" others="mt-4" />
        </div>

        {/* verified users */}
        <div className="bg-mutedLight border border-muted p-6 rounded-lg">
          <div className="flex-between">
            <p className="font-inter text-[17px]">Verified Users</p>
            <FiUserCheck size={20} />
          </div>
          <H2 font="inter" text="345" others="mt-4" />
        </div>

        {/* Banned users */}
        <div className="bg-mutedLight border border-muted p-6 rounded-lg">
          <div className="flex-between">
            <p className="font-inter text-[17px]">Banned Users</p>
            <FiUserX size={20} />
          </div>
          <H2 font="inter" text="16" others="mt-4" />
        </div>

        {/* Pending appeals */}
        <div className="bg-mutedLight border border-muted p-6 rounded-lg">
          <div className="flex-between">
            <p className="font-inter text-[17px]">Pending Appeals</p>
            <PiWarningCircle size={20} />
          </div>
          <H2 font="inter" text="5" others="mt-4" />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-mutedLight rounded-lg mt-8 md:w-150 mx-auto">
        <div 
          onClick={() => setTab("users")} 
          className={`${tab === "users" && "bg-white"} flex-center gap-2 p-2 rounded-md cursor-pointer`}
        >
          <FiUser />
          <p>Users</p>
        </div>
        <div 
          onClick={() => setTab("appeals")} 
          className={`${tab === "appeals" && "bg-white"} flex-center gap-2 p-2 rounded-md cursor-pointer`}
        >
          <PiWarningCircle size={17} />
          <p>Appeals</p>
        </div>
      </div>

      {tab === "users" ? 
        <UsersTab setModalActive={setUserModalActive} /> 
        : 
        <AppealsTab setModalActive={setAppealModalActive} />
      }
    </main>
  )
}

export default AdminPage