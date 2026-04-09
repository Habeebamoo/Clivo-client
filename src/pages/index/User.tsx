import { H2 } from "../../components/Typo"
import { MdVerified } from "react-icons/md"
import { BiLink } from "react-icons/bi"
import avatar from "../../assets/avatar.jpg"
import type { User } from "../../redux/reducers/user_reducer"
import { useParams } from "react-router"
import type { Post } from "../../redux/reducers/article_reducer"
import Loading from "../../components/Loading"
import ArticleDisplay from "../../components/ArticleDisplay"
import NotFoundPage from "./NotFoundPage"
import { useFetchProfile } from "../../hooks/useFetchProfile"
import { useSelector } from "react-redux"
import { useFetchUser } from "../../hooks/useFetchUser"
import { useEffect, useState } from "react"
import Alert from "../../components/Alert"

const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useFetchUser(username!);
  
  const {} = useFetchProfile();
  const me = useSelector((state: any) => state.user.profile);

  const [isFollowing, setIsFollowing] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "error">("success")
  const [alertText, setAlertText] = useState<string>("")

  useEffect(() => {
    if (!me.userId) {
      return
    }

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/follow-status/${me.userId}/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY 
          }
        })

        const response = await res.json()

        if (!response.success) {
          console.error("failed to get follow status")
          return
        }

        setIsFollowing(response.data.status)
        console.log(response.data)
        
      } catch (error) {
        console.error("failed to get follow status")
      }
    }

    fetchFollowStatus();

  }, [me.userId])

  useEffect(() => {
    if (alertModal) {
      setTimeout(() => {
        setAlertModal(false)
      }, 3000)
    }
  }, [alertModal])

  const setAlert = (status: "success" | "error", text: string) => {
    setAlertModal(true)
    setAlertStatus(status)
    setAlertText(text)
  }

  const user: User | undefined = data?.user;
  const articles: Post[] | undefined = data?.userArticles;

  const myProfile = useSelector((state: any) => state.user.profile);

  const isProfileOwner = myProfile.username === user?.username;

  if (isLoading) return <Loading />;
  
  if (isError) return <NotFoundPage />;

  const toggleFollow = async () => {
    setIsFollowing(!isFollowing)

    if (isProfileOwner) {
      setAlert("error", "You can't follow yourself")
      setLoading(false)
      return
    }

    const path = isFollowing ? "unfollow" : "follow";

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${path}/${user?.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        setAlert("error", response.message)
        return
      }

      setAlert("success", response.message)

    } catch (error) {
      setAlert("error", "Something went wrong")
    }
  }

  const followBtnText = isFollowing ? "Unfollow" : "Follow";

  return (
    <>
      {loading && <Loading />}
      {alertModal && <Alert status={alertStatus} text={alertText} />}
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:mt-10 lg:w-225 mx-auto items-start">
        <section>
          {/* Profile Picture */}
          <div>
            <div className="h-40 bg-mutedLight relative flex-center flex-col">
              <H2 font="exo" text="Clivo" color="accent" />
              <p className="text-[12px] text-accentLight mt-1">Where Simple Stories Find Thier Voices</p>

              {/* profile pic */}
              <div className="bg-white p-1 h-26 w-26 rounded-full flex-center absolute left-7 -bottom-17.5">
                <div className="h-24 w-24 rounded-full overflow-hidden border border-accentLight">
                  {user!.picture ? (
                    <img src={user!.picture} className="h-full w-full object-cover" />
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
              <H2 font="dm" text={user!.name} />
              {user!.verified && <MdVerified size={18} color="rgba(93, 110, 189, 1)" />}
            </div>

            {/* username */}
            <p className="text-[12px] text-accentLight underline font-inter">{user!.username}</p>

            {/* Bio */}
            <p className="font-outfit text-sm text-accent mt-4">{user!.bio}</p>

            {/* website */}
            {user!.website && 
              <div className="flex-start gap-1 mt-4">
                <BiLink />
                <a 
                  href={user!.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-[12px] underline cursor-pointer"
                >
                  {user!.website}
                </a>
              </div>
            }
            
            {/* follows */}
            <div className="text-sm text-accent font-inter flex-start mt-3 gap-2">
              <p>{user!.following} Following</p>
              <div className="h-1 w-1 bg-accentLight rounded-full"></div>
              <p>{user!.followers} Followers</p>
            </div>

            {me.userId && !isProfileOwner ?
              <button 
                onClick={toggleFollow} 
                className="btn-primary px-6 py-3 mt-4 text-sm rounded-full"
              >
                {followBtnText}
              </button>
            :
              null
            }
          </div>

        </section>

        <hr className="lg:hidden text-mutedLight" />
        
        <section className="px-8 mb-20">
          {/* Articles */}
          {articles!.length == 0 && 
            <div className="flex-center flex-col mb-20 lg:mt-10">
              <img src={avatar} className="h-70" />
              <H2 font="inter" text="This user hasn't posted anything!" others="mt-6 text-center" />
            </div>
          }
          {articles!.length != 0 && 
            <div>
              {articles!.map((article: Post) => {
                return <ArticleDisplay key={article.articleId} article={article} />
              })}
            </div>
          }

        </section>
      </main>
    </>
  )
}

export default UserPage