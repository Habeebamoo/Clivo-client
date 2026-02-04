import { useState, type ChangeEvent } from "react"
import InterestsCard from "../../components/InterestsCard"
import Spinner from "../../components/Spinner"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"
import Editor from "../../components/Editor"

const CreateArticle = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<any>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [interest, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)

    if (!content) {
      setLoading(false)
      return
    }

    const formData = new FormData();

    formData.append("title", title)
    formData.append("content", JSON.stringify(content))
    formData.append("picture", selectedFile!)
    interest.forEach((tag) => formData.append("tags[]", tag))

    content.blocks.forEach((block: any, i: number) => {
      if (block.type === "image" && block.data.file instanceof File) {
        formData.append(`image_${i}`, block.data.file);
        block.data.file.url = `__UPLOAD_IMAGE_${i}`;
      }
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/article`, {
        method: "POST",
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
      setTimeout(() => navigate("/home/profile"), 3000)
    } catch (error) {
      toast.error("Something went wrong. Please try again")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    setSelectedFile(file)

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file)
  }

  const nextStep = () => {
    if (!content) {
      toast.error("Please save your blog")
      return
    }

    setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  const saveContent = (data: any) => {
    setContent(data)
  }

  return (
    <main className="w-[93%] md:w-150 mx-auto mt-22 mb-20">
      {step === 1 ?
        <section className="px-2">
          <div className="flex-end">
            <button 
              onClick={nextStep} 
              className="btn-gray flex-center gap-2 rounded-full py-2 px-4 text-sm"
            >
              Next
              <SlArrowRight size={10} />
            </button>
          </div>

          <textarea 
            rows={2}
            className="focus:outline-none w-full font-dm wrap-break-word rounded-lg placeholder:text-gray-500 text-2xl resize-none my-8"
            placeholder="Title Here"
            value={title}
            onChange={e => setTitle(e.target.value)}
          ></textarea>

          <Editor saveContent={saveContent} />
        </section>
      :
        <section className="p-2">
          <button onClick={prevStep} className="btn-gray text-sm rounded-full flex-center gap-2">
            <SlArrowLeft size={10} />
            Previous
          </button>
          <div className="mt-6">
            <label 
              htmlFor="picture" 
              className={`cursor-pointer transition h-60 border font-inter border-dashed border-accentLight block ${preview ? "bg-cover bg-center" : "text-gray-600"}`}
              style={preview ? {backgroundImage: `url(${preview})`} : {}}
            >
              {!preview && <p className="h-full flex-center">Add Picture</p>}
            </label>
            <input 
              type="file" 
              id="picture" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
          <div className="mt-8">
            <p className="font-inter mb-4">Select Tags</p>
            <InterestsCard 
              interests={interest} 
              setInterests={setInterests} 
              placeholder="Search Tags"
            />
          </div>

          <div className="flex-center gap-2 mt-10">
            {loading ? 
              <button className="btn-primary bg-gray-300 border-gray-300 hover:bg-gray-300 hover:text-white cursor-not-allowed py-3 w-25 flex-center">
                <Spinner size={18} color="white" />
              </button> 
            : 
              <button 
                onClick={handleSubmit} 
                className="btn-primary py-3 px-6"
              >
                Publish
              </button>
            }
          </div>
        </section>
      }
    </main>
  )
}

export default CreateArticle