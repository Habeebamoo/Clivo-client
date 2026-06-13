"use client";

import { useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Spinner from "./spinner";
import InterestsCard from "./interests-card";

interface EditorProps {
  saveContent: (data: any) => void;
}

const Editor = dynamic<EditorProps>(
  () => import("@/src/components/editor"), 
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-center text-sm text-gray-400">
        Initializing workspace editor...
      </div>
    ),
  }
);

interface CreateArticlePageProps {
  saveContent?: (data: any) => void;
}

const CreateArticlePage = ({ saveContent }: CreateArticlePageProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<any>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [interest, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    if (!content) {
      toast.error("Please provide article body content before publishing.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));
    
    if (selectedFile) {
      formData.append("picture", selectedFile);
    }
    
    interest.forEach((tag) => formData.append("tags[]", tag));

    // Structural loop verifying custom inline files embedded inside blocks
    if (content.blocks) {
      content.blocks.forEach((block: any, i: number) => {
        if (block.type === "image" && block.data.file instanceof File) {
          formData.append(`image_${i}`, block.data.file);
          block.data.file.url = `__UPLOAD_IMAGE_${i}`;
        }
      });
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/article`, {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: formData,
        credentials: "include",
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.message || "Failed to submit post data.");
        return;
      }

      toast.success(response.message || "Article published successfully!");
      setTimeout(() => router.push("/home/profile"), 3000);
    } catch (error) {
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (!title.trim()) {
      toast.error("Please add a title before continuing.");
      return;
    }
    if (!content || (content.blocks && content.blocks.length === 0)) {
      toast.error("Please write and save your blog layout.");
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSaveContent = (data: any) => {
    setContent(data);
    if (saveContent) saveContent(data); // Propagate up to root page component context if defined
  };

  return (
    <main className="w-[93%] md:w-150 mx-auto mt-10 mb-20">
      {step === 1 ? (
        <section className="px-2">
          <div className="flex justify-end">
            <button
              onClick={nextStep}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium flex items-center gap-2 rounded-full py-2 px-4 text-sm transition-colors"
            >
              Next Step
              <SlArrowRight size={10} />
            </button>
          </div>

          <textarea
            rows={2}
            className="focus:outline-none w-full font-sans font-bold tracking-tight wrap-break-word rounded-lg placeholder:text-gray-400 text-4xl resize-none my-8 border-none p-0"
            placeholder="Title Here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Editor saveContent={handleSaveContent} />
        </section>
      ) : (
        <section className="p-2 animate-fadeIn">
          <button
            onClick={prevStep}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm rounded-full flex items-center gap-2 py-2 px-4 transition-colors"
          >
            <SlArrowLeft size={10} />
            Back to Content
          </button>
          
          <div className="mt-8">
            <p className="font-semibold text-lg mb-2 text-gray-700">Cover Image</p>
            <label
              htmlFor="picture"
              className={`cursor-pointer transition-all duration-200 min-h-60 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 overflow-hidden ${
                preview ? "bg-cover bg-center" : "text-gray-500"
              }`}
              style={preview ? { backgroundImage: `url(${preview})` } : {}}
            >
              {!preview && (
                <div className="text-center p-6">
                  <p className="font-medium text-sm text-indigo-600">Click to upload file</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</p>
                </div>
              )}
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
            <p className="font-semibold text-lg mb-2 text-gray-700">Tags & Categorization</p>
            <p className="text-xs text-gray-400 mb-4">Select categories relevant to this publication</p>
            <InterestsCard
              interests={interest}
              setInterests={setInterests}
              placeholder="Search Tags..."
            />
          </div>

          <div className="flex justify-center gap-2 mt-12">
            {loading ? (
              <button className="bg-gray-300 text-white rounded-lg py-3 w-32 flex items-center justify-center cursor-not-allowed">
                <Spinner size={18} color="white" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-primary cursor-pointer text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm"
              >
                Publish Article
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default CreateArticlePage;