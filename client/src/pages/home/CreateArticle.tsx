import { useEffect, useState, type ChangeEvent } from "react"
import TextEditor from "../../components/TextEditor"
import InterestsCard from "../../components/InterestsCard"

const CreateArticle = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [preview, setPreview] = useState<string | null>(null)
  const [interest, setInterests] = useState<string[]>([])

  useEffect(() => console.log(content), [content])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file)
  }

  const nextStep = () => {
    setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  return (
    <main className="w-[93%] md:w-[600px] mx-auto mt-25 mb-20">
      {step === 1 ?
        <section>
          <textarea 
            rows={1}
            className="p-4 focus:outline-none w-full font-dm break-words rounded-lg placeholder:text-accentLight text-2xl resize-none"
            placeholder="Title Here"
            value={title}
            onChange={e => setTitle(e.target.value)}
          ></textarea>

          <TextEditor setContent={setContent} />

          <button onClick={nextStep} className="btn-primary mt-8">Next</button>
        </section>
      :
        <section>
          <div>
            <label 
              htmlFor="picture" 
              className={`cursor-pointer transition h-60 border-1 font-inter border-dashed border-accentLight block ${preview ? "bg-cover bg-center" : "text-gray-600"}`}
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

          <div className="flex-start gap-4 mt-8">
            <button onClick={prevStep} className="btn-primary bg-red-500 border-red-500 hover:text-red-500">
              Previous
            </button>
            <button className="btn-primary">Publish</button>
          </div>
        </section>
      }
    </main>
  )
}

export default CreateArticle