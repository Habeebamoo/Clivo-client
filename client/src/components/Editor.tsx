import EditorJs, { type ToolConstructable } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Code from "@editorjs/code"
import Image from "@editorjs/image"
import { memo, useEffect, useRef } from "react"

const tools: Record<string, ToolConstructable> = {
  header: Header as unknown as ToolConstructable,
  list: List as unknown as ToolConstructable,
  code: Code as unknown as ToolConstructable,
  image: Image as unknown as ToolConstructable
}

interface Props {
  saveContent: (data: any) => void
}

const Editor = ({ saveContent }: Props) => {
  const editorRef = useRef<EditorJs | null>(null);

  useEffect(() => {
   if (!editorRef.current) {
     editorRef.current = new EditorJs({ 
      holder: "editor",
      placeholder: "Write your article here",
      tools: {
        ...tools,
        image: {
          class: Image as unknown as ToolConstructable,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                return {
                  success: 1,
                  file: { url: URL.createObjectURL(file) }
                }
              }
            }
          }
        }
      }
    })
   }

    return () => {
      editorRef.current?.destroy
      ();
      editorRef.current = null;
    }
  })

  const onSave = async () => {
    if (!editorRef.current) return;

    const output = await editorRef.current.save();
    saveContent(output)
  }

  return (
    <>
      <button onClick={onSave} className="btn-primary mb-4">
        Save
      </button>
      <div id="editor" className="font-jsans" />
    </>
  )
}

const memoEditor = memo(Editor)
export default memoEditor