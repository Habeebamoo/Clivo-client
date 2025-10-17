import { useSelector } from "react-redux"
import { H1, H2 } from "../../components/Typo"
import { BiLink, BiPencil, BiPlus } from "react-icons/bi"
import { MdDateRange, MdVerified } from "react-icons/md"
import { useNavigate } from "react-router"
import type { User } from "../../redux/reducers/user_reducer"
import MyArticles from "../../components/MyArticles"
import { useFetchProfile } from "../../hooks/useFetchProfile"
import Loading from "../../components/Loading"

const MyProfile = () => {
  const { isLoading, } = useFetchProfile()
  const user: User = useSelector((state: any) => state.user.profile);
  console.log(user)
  const navigate = useNavigate()

  const toSettings = () => {
    navigate("/dashboard/settings")
  }

  if (isLoading) return <Loading />

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:w-[900px] mx-auto items-start">
      <section>
        {/* Profile Picture */}
        <div>
          <div className="h-40 bg-mutedLight relative flex-center flex-col">
            <H1 font="exo" text="Clivo" color="accent" />
            <p className="text-[12px] text-accentLight mt-1 font-exo">Where Simple Stories Find Thier Voices</p>

            {/* profile pic */}
            <div className="bg-white p-1 h-26 w-26 rounded-full flex-center absolute left-7 bottom-[-70px]">
              <div className="h-24 w-24 rounded-full overflow-hidden border-1 border-accentLight">
                {user.picture ? (
                  <img src={user.picture} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full object-cover bg-muted"></div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* User */}
        <div className="mt-20 px-8">
          {/* Name */}
          <div className="flex-start gap-2">
            <H2 font="exo" text={user.name} />
            {user.verified ? 
              <MdVerified size={18} color="rgba(93, 110, 189, 1)" /> : 
              <p className="text-[12px] underline cursor-pointer">
                Get Verified
              </p>
            }

          </div>

          {/* username */}
          <p className="text-[12px] text-accentLight underline font-inter">{user.username}</p>

          {/* Bio */}
          <p className="font-exo text-sm text-accent mt-4">{user.bio}</p>
          {user.website && 
            <div className="flex-start gap-1 mt-2">
              <BiLink />
              <a href={user.website} className="text-blue-500 text-[12px] underline cursor-pointer">My Website</a>
            </div>
          }
          
          {/* follows */}
          <div className="text-sm text-accent font-inter flex-start mt-2 gap-2">
            <p>{user.following} Following</p>
            <div className="h-1 w-1 bg-accentLight rounded-full"></div>
            <p>{user.followers} Followers</p>
          </div>

          {/* others */}
          <div className="mt-3 flex-start gap-2 text-[12px] font-exo text-accent">
            <MdDateRange size={16} />
            <p>Joined {user.createdAt}</p>
          </div>

          <div className="mt-6 flex-start gap-4">
            <button onClick={toSettings} className="text-sm flex-center gap-2 py-2 px-3 border-1 border-accent rounded-full hover:bg-muted active:bg-muted cursor-pointer">
              <BiPencil />
              <span>Edit Profile</span>
            </button>
            <button className="text-sm flex-center gap-2 py-2 px-3 btn-primary rounded-full">
              <BiPlus />
              <span>New Article</span>
            </button>
          </div>
        </div>

      </section>

      <hr className="lg:hidden text-mutedLight" />
      
      <section className="px-8">
        {/* Articles */}
        <MyArticles />
      </section>
    </main>
  )
}

export default MyProfile