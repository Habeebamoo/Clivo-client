import { useSelector } from "react-redux"
import { H1, H2 } from "../../components/Typo"
import { BiLink, BiPencil, BiPlus } from "react-icons/bi"
import { MdDateRange, MdVerified } from "react-icons/md"
import logo from "../../assets/logo2.png"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../../components/Spinner"
import ArticleDisplay from "../../components/ArticleDisplay"
import type { Post } from "../../redux/reducers/article_reducer"
import avatar from "../../assets/avatar.jpg"
import { useNavigate } from "react-router"
import type { User } from "../../redux/reducers/user_reducer"

const getArticles = async () => {
  //real logic

  //fake logic
  await new Promise((resolve) => setTimeout(resolve, 2000)
  );

  const articles: Post[] = [
    {articleId:"jfif", authorPicture: logo, authorFullname: "Clivo", authorVerified: true, title:"How to get a verified account", content: "Hello", createdAt: "2 months ago", picture: logo, tags: ["Tech", "Design", "Business"], likes: 5, readTime: "1 mins read time", slug: ""},
    {articleId: "weio", authorPicture: "", authorFullname: "Habeeb Amoo", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], likes: 16, readTime: "6 mins read time", slug: ""},
  ];

  return articles;
}

const MyProfile = () => {
  const user: User = useSelector((state: any) => state.user.user);
  const { data, isLoading } = useQuery({
    queryKey: ["my-articles"],
    queryFn: getArticles
  })
  const navigate = useNavigate()

  const toSettings = () => {
    navigate("/dashboard/settings")
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:w-[900px] mx-auto items-start">
      <section>
        {/* Profile Picture */}
        <div>
          <div className="h-40 bg-mutedLight relative flex-center flex-col">
            <H2 font="exo" text="Clivo" color="accent" />
            <p className="text-[12px] text-accentLight mt-1">Where Simple Stories Find Thier Voices</p>

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
              <p className="text-blue-500 text-[12px] underline cursor-pointer">{user.website}</p>
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
        {isLoading && 
          <div className="flex-center my-20">
            <Spinner size={20} color="accentLight" />
          </div>
        }

        {/* Articles */}
        {data?.length == 0 && 
          <div className="flex-center flex-col mb-20 lg:mt-10">
            <img src={avatar} className="h-70" />
            <H1 font="inter" text="This user hasn't posted anything!" others="mt-6 text-center" />
          </div>
        }
        {data?.length != 0 && <MyArticles data={data} />}

      </section>
    </main>
  )
}

const MyArticles = ({ data }: { data: Post[] | undefined }) => {
  return (
    <>
      {data?.map((article) => {
        return <ArticleDisplay article={article} />
      })}
    </>
  )
}

export default MyProfile