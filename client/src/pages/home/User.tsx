import { useQuery } from "@tanstack/react-query"
import { H2 } from "../../components/Typo"
import { MdVerified } from "react-icons/md"
import { BiLink } from "react-icons/bi"
import avatar from "../../assets/avatar.jpg"
import type { User } from "../../redux/reducers/user_reducer"
import { useParams } from "react-router"
import type { Post } from "../../redux/reducers/article_reducer"
import Loading from "../../components/Loading"
import NotFound from "../../components/NotFound"
import ArticleDisplay from "../../components/ArticleDisplay"

const getUser = async (username: string) => {
  try {
    console.log(import.meta.env.SERVER_URL)
    //get user
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY 
      }
    })
    const response = await res.json()

    if (!response.success) {
      throw new Error(response.message)
    }

    const user: User = response.data;
    console.log("1")

    //get user articles
    const res2 = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${username}/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY 
      }
    })
    const response2 = await res2.json()

    if (!response2.success) {
      throw new Error(response.message)
    }

    const userArticles: Post[] = response2.data;

    console.log("en")
    return { user, userArticles };
    
  } catch (error) {
    throw new Error("")
  }
}

const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(username!)
  })

  const user: User | undefined = data?.user;
  const articles: Post[] | undefined = data?.userArticles;

  console.log(data)

  if (isLoading) return <Loading />;
  
  if (isError) return <NotFound text="User Not Found" subText="We couldn't find this user. Please visit a valid profile url" />;

  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:mt-10 lg:w-[900px] mx-auto items-start">
        <section>
          {/* Profile Picture */}
          <div>
            <div className="h-40 bg-mutedLight relative flex-center flex-col">
              <H2 font="exo" text="Clivo" color="accent" />
              <p className="text-[12px] text-accentLight mt-1">Where Simple Stories Find Thier Voices</p>

              {/* profile pic */}
              <div className="bg-white p-1 h-26 w-26 rounded-full flex-center absolute left-7 bottom-[-70px]">
                <div className="h-24 w-24 rounded-full overflow-hidden border-1 border-accentLight">
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
              <H2 font="exo" text={user!.name} />
              {user!.verified && <MdVerified size={18} color="rgba(93, 110, 189, 1)" />}
            </div>

            {/* username */}
            <p className="text-[12px] text-accentLight underline font-inter">{user!.username}</p>

            {/* Bio */}
            <p className="font-exo text-sm text-accent mt-4">{user!.bio}</p>
            {user!.website && 
              <div className="flex-start gap-1 mt-2">
                <BiLink />
                <p className="text-blue-500 text-[12px] underline cursor-pointer">{user!.website}</p>
              </div>
            }
            
            {/* follows */}
            <div className="text-sm text-accent font-inter flex-start mt-2 gap-2">
              <p>{user!.following} Following</p>
              <div className="h-1 w-1 bg-accentLight rounded-full"></div>
              <p>{user!.followers} Followers</p>
            </div>

            <button className="btn-primary px-4 mt-4 text-sm rounded-full">Follow</button>
          </div>

        </section>

        <hr className="lg:hidden text-mutedLight" />
        
        <section className="px-8">
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
                return <ArticleDisplay article={article} />
              })}
            </div>
          }

        </section>
      </main>
    </>
  )
}

export default UserPage