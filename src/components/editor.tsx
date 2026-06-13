"use client";

import { memo, useEffect, useRef, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";

// We import EditorJS dynamically inside the useEffect to stop it from crashing Next.js
interface Props {
  saveContent: (data: any) => void;
}

const Editor = ({ saveContent }: Props) => {
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !holderRef.current) return;

    // 1. If an editor exists OR is currently loading, STOP immediately.
    if (editorRef.current || (holderRef.current as any).isInitializing) return;

    // 2. Set a temporary lock directly on the DOM element so the second render sees it instantly
    (holderRef.current as any).isInitializing = true;

    const initEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Code = (await import("@editorjs/code")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const Image = (await import("@editorjs/image")).default;

        if (!holderRef.current) return;

        const editor = new EditorJS({
          holder: holderRef.current,
          placeholder: "Click here to start writing your article...",
          inlineToolbar: true,
          tools: {
            header: Header,
            list: List,
            code: Code,
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/link-preview`,
              },
            },
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    const formData = new FormData();
                    formData.append("image", file);
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/article/image`,
                      {
                        method: "POST",
                        headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY! },
                        body: formData,
                        credentials: "include",
                      }
                    );
                    const data = await res.json();
                    return { success: 1, file: { url: data.data.url } };
                  },
                },
              },
            },
          },
          onChange: () => {
            setIsSaved(false);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Failed to load the editor:", error);
      } finally {
        // Remove the initialization lock once finished
        if (holderRef.current) {
          delete (holderRef.current as any).isInitializing;
        }
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        if (typeof editorRef.current.destroy === "function") {
          try {
            editorRef.current.destroy();
          } catch (e) {
            console.error("Error destroying editor instance:", e);
          }
        }
        editorRef.current = null;
      }
    };
  }, []);

  const onSave = async () => {
    if (!editorRef.current) return;
    const output = await editorRef.current.save();
    saveContent(output);
    setIsSaved(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editor Canvas</span>
        {!isSaved ? (
          <button 
            onClick={onSave} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-xs py-1.5 px-4 transition-colors"
          >
            Save Draft Layout
          </button>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 rounded-md py-1.5 px-3 flex items-center gap-1.5 text-xs font-medium border border-emerald-200">
            <span>Saved to Step 1!</span>
            <BiCheckCircle className="text-emerald-600" />
          </div>
        )}
      </div>

      {/* This is the actual box where you write. It uses our new custom CSS wrapper */}
      <div ref={holderRef} className="editor-wrapper" />
    </div>
  );
};

export default memo(Editor);