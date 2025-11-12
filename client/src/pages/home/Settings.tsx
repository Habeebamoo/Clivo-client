import { useState } from "react"
import { H1 } from "../../components/Typo"
import { BiPencil } from "react-icons/bi"
import Input from "../../components/Input"
import Spinner from "../../components/Spinner"
import { toast } from "react-toastify"
import { FiLink } from "react-icons/fi"
import { useSelector } from "react-redux"
import type { User } from "../../redux/reducers/user_reducer"

const Modal = ({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean | undefined>> }) => {
  const user: User = useSelector((state: any) => state.user.profile)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | string>("")
  const [picture] = useState<string>(user.picture)
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    website: user.website,
    bio: user.bio
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("email", form.email)
    formData.append("website", form.website)
    formData.append("bio", form.bio)

    if (file) formData.append("picture", file)

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/profile`, {
        method: "PATCH",
        headers: {
          "X-API-KEY": import.meta.env.VITE_API_KEY
        },
        body: formData,
        credentials: "include"
      })

      const response = await res.json()

      if (!res.ok) {
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setTimeout(() => window.location.href = "/home/profile", 3000)

    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const closeModal = () => {
    if (loading) return
    setModal(false)
  }

  return (
    <section className="bg-black/80 fixed top-0 bottom-0 left-0 right-0 z-20 flex-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 border-1 border-gray-100 rounded-md w-[90%] sm:w-[400px] mx-auto">
        {/* cancel */}
        <div className="flex-end mb-4">
          <button onClick={closeModal} className="py-1 px-3 bg-red-600 text-white text-sm font-outfit rounded-md border-1 border-red-600 hover:bg-transparent hover:text-red-600 active:bg-transparent active:text-red-600 cursor-pointer">Cancel</button>
        </div>

        {/* picture */}
        <div className="flex-start gap-4 mb-8">
          <div className="h-20 w-20 rounded-full flex-center overflow-hidden">
            {preview && <img src={preview} alt="profile" className="w-full h-full object-cover" />}
            {!preview && picture && <img src={picture} alt="profile" className="w-full h-full object-cover" />}
            {!preview && !picture && <span className="text-gray-400 text-3xl">+</span>}
          </div>
          <div>
            <label 
              htmlFor="file-upload"
              className="text-blue-500 cursor-pointer hover:text-blue-800 active:text-blue-800">
              <span className="font-outfit">Change Photo</span>
            </label>
            <input 
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* name */}
        <div className="font-open text-sm">
          <p className="mb-2">Name</p>
          <Input 
            type="text" 
            name="name"   
            value={form.name} 
            onChange={handleFormChange} 
          />
        </div>

        {/* email */}
        <div className="mt-6 font-open text-sm">
          <p className="mb-2">Email</p>
          <Input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleFormChange} 
          />
        </div>

        {/* website */}
        <div className="font-open text-sm mt-6">
          <p className="mb-2">Link</p>
          <Input 
            type="url" 
            name="website" 
            color="text-blue-500" 
            placeholder="https://"
            value={form.website}
            onChange={handleFormChange} 
          />
        </div>

        {/* bio */}
        <div className="font-open text-sm mt-6">
          <p className="mb-2">Bio</p>
          <textarea 
            name="bio"
            value={form.bio}
            onChange={handleFormChange}
            className="border-b-1 border-b-accentLight focus:outline-none w-full py-1 placeholder:text-accentLight resize-none"
          ></textarea>
        </div>

        {loading ?
          <button className="bg-gray-300 w-full py-3 flex-center text-white mt-6 rounded-md">
            <Spinner size={18} color="white" />
          </button>
        :
          <button className="btn-primary w-full mt-6 py-2">
            Update Profile
          </button>
        }
      </form>
    </section>
  )
}

const SettingsPage = () => {
  const user: User = useSelector((state: any) => state.user.profile)
  const [modal, setModal] = useState<boolean>()

  const showModal = () => {
    setModal(true)
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(user.profileUrl).
      then(() => toast.success("Profile URL Copied.")).
      catch((e) => toast.error(`Something went wrong ${e.message}`))
  }

  return (
    <main className="w-[90%] sm:w-[400px] mx-auto">
      {modal && <Modal setModal={setModal} />}
      <H1 font="inter" text="Settings" others="mt-25" />
      <div className="my-10">
        <p className="font-inter mb-2">Account</p>
        <hr className="text-gray-200" />
      </div>
      <div className="text-accent text-sm font-open">
        <div className="flex-between mb-6">
          <p>Name</p>
          <p>{user.name}</p>
        </div>
        <div className="flex-between mb-6">
          <p>Email</p>
          <p>{user.email}</p>
        </div>
        <div className="flex-between mb-6">
          <p>Link</p>
          <a href="#" className="text-blue-600 text-underline">
            {user.website}
          </a>
        </div>
        <div className="">
          <p>Bio</p>
          <p className="mt-4 font-dm">{user.bio}</p>
        </div>
      </div>

      {/* buttons */}
      <div className="mt-10 flex-start gap-4">
        <button onClick={showModal} className="btn-primary flex-center gap-2">
          <p>Edit</p>
          <BiPencil />
        </button>
        <button onClick={copyProfileLink} className="btn-primary flex-center gap-2">
          <p>Share Profile</p>
          <FiLink />
        </button>
      </div>
    </main>
  )
}

export default SettingsPage