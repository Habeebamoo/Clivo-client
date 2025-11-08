import { useState } from "react"
import { H2 } from "../../components/Typo"
import { BiPencil } from "react-icons/bi"
import pic from "../../assets/logo.jpg"
import Input from "../../components/Input"
import Spinner from "../../components/Spinner"

const Modal = ({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean | undefined>> }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | string>(pic)
  const [picture] = useState<string>(pic)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log(file)
    } catch (error) {
      
    } finally {

    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const closeModal = () => {
    setModal(false)
  }

  return (
    <section className="bg-black/80 fixed top-0 bottom-0 left-0 right-0 z-20 flex-center">
      <form className="bg-white p-6 border-1 border-gray-100 rounded-md w-[90%] sm:w-[400px] mx-auto">
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
        <div>
          <p className="font-inter mb-2">Name</p>
          <Input type="text" placeholder="" />
        </div>

        {/* email */}
        <div className="mt-6">
          <p className="font-inter mb-2">Email</p>
          <Input type="email" placeholder="" />
        </div>

        {/* website */}
        <div className="mt-6">
          <p className="font-inter mb-2">Website</p>
          <Input type="url" placeholder="" color="text-blue-500" />
        </div>

        {/* bio */}
        <div className="mt-6">
          <p className="font-inter mb-2">Bio</p>
          <textarea className="border-b-1 border-b-accentLight focus:outline-none w-full py-1 font-inter placeholder:text-accentLight resize-none">

          </textarea>
        </div>

        {loading ?
          <button className="bg-gray-300 w-full py-3 flex-center text-white mt-6 rounded-md">
            <Spinner size={18} color="white" />
          </button>
        :
          <button onClick={handleSubmit} className="btn-primary w-full mt-6 py-2">
            Update Profile
          </button>
        }
      </form>
    </section>
  )
}

const SettingsPage = () => {
  const [modal, setModal] = useState<boolean>()

  const showModal = () => {
    setModal(true)
  }

  return (
    <main className="w-[93%] sm:w-[400px] mx-auto">
      {modal && <Modal setModal={setModal} />}
      <H2 font="inter" text="Settings" others="mt-25" />
      <div className="text-accent text-sm font-inter mt-12">
        <div className="h-18 w-18 rounded-full overflow-hidden mb-6">
          <img src={pic} alt="h-full w-full" />
        </div>
        <div className="flex-between mb-6">
          <p>Name</p>
          <p>Habeeb Amoo</p>
        </div>
        <div className="flex-between mb-6">
          <p>Email</p>
          <p>habeebamoo08@gmail.com</p>
        </div>
        <div className="flex-between mb-6">
          <p>Website</p>
          <a href="#" className="text-blue-600 text-underline">habeebamoo.netlify.app</a>
        </div>
        <div className="">
          <p>Bio</p>
          <p className="mt-4 font-dm pl-2">Software Developer</p>
        </div>
      </div>
      <button onClick={showModal} className="btn-primary flex-center gap-2 mt-8">
        <p>Edit</p>
        <BiPencil />
      </button>
    </main>
  )
}

export default SettingsPage