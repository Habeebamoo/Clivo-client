import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import type { User } from "../redux/reducers/user_reducer";
import { MdVerified } from "react-icons/md";
import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/reducers/admin_reducer";
import { useFetchAdminStats } from "../hooks/useFetchAdminStats";

interface PropsType {
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UsersTab = ({ setModalActive }: PropsType) => {
  const dispatch = useDispatch();
  const {} = useFetchAdminStats();

  const users: User[] = useSelector((state: any) => state.admin.users);
  const [query, setQuery] = useState<string>("");

  console.log(users)

  const handleAction = (user: User) => {
    dispatch(setUser(user))
    setModalActive(true)
  }

  return (
    <section className="bg-mutedLight border border-muted rounded-lg md:w-150 lg:w-200 mx-auto mt-10 mb-10 p-4">
      <h1 className="font-inter">User Management</h1>
      <p className="font-exo text-sm text-accent">View and manage all platform users</p>

      {/* Search Box */}
      <div className="text-accent relative mt-4">
        <div className="absolute top-2.75 left-3"><FaSearch /></div>
        <input 
          type="search" 
          className="border border-muted p-2 w-full sm:w-87.5 rounded-md focus:outline-none pl-9 text-sm" 
          placeholder="Search users by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* users */}
      <div className="w-full overflow-x-auto py-4">
        <table className="min-w-225 mx-auto w-full border-collapse table-fixed">
          <thead>
            <tr className="text-left">
              <th className="w-25 font-exo text-sm py-2">Picture</th>
              <th className="w-37.5 font-exo text-sm py-2">Name</th>
              <th className="w-50 font-exo text-sm py-2">Email</th>
              <th className="w-25 font-exo text-sm py-2">Status</th>
              <th className="w-30 font-exo text-sm py-2">Joined</th>
              <th className="w-25 font-exo text-sm py-2">Action</th>
            </tr>
          </thead>
          {users.length >= 1 &&
             <tbody>
              {users.map(user => <UserDisplay key={user.userId} user={user} action={handleAction} />)}
            </tbody>
          }
        </table>
      </div>
    </section>
  )
}

const UserDisplay = ({ user, action }: { user: User, action: (user: User) => void }) => {
  const showModal = () => {
    action(user)
  }

  return (
    <tr className="hover:bg-gray-50 cursor-pointer">
      {/* picture */}
      <td className="py-2">
        <div className="h-7 w-7 rounded-full overflow-hidden">
          <img src={user.picture} className="h-full w-full" />
        </div>
      </td>

      {/* name */}
      <td className="truncate py-2">
        <div className="flex-start gap-1 text-sm">
          <p className="font-exo text-accent">{user.name}</p>
          {user.verified && <MdVerified color="rgba(93, 110, 189, 1)" />}
        </div>
      </td>

      {/* email */}
      <td className="truncate py-2">
        <p className="font-exo text-accent text-sm">{user.email}</p>
      </td>

      {/* status */}
      <td className="truncate py-2">
        <div className={`${user.isBanned ? "bg-red-400 text-white" : "bg-green-300"} inline-block py-1 px-3 rounded-lg text-sm`}>
          {user.isBanned ? "Banned" : "Active"}
        </div>
      </td>

      {/* created at */}
      <td className="truncate py-2">
        <p className="font-exo text-accent text-sm">Joined {user.createdAt}</p>
      </td>

      <td className="truncate py-2">
        <button onClick={showModal} className="font-inter text-sm py-2 btn-primary">
          <SlArrowRight />
        </button>
      </td>
    </tr>
  )
}

export default UsersTab