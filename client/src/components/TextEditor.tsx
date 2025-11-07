import { BiRedo, BiUndo } from "react-icons/bi"
import { FiLink } from "react-icons/fi"
import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from"@tiptap/extension-placeholder"

const TextEditor = ({ setContent }: { setContent: React.Dispatch<React.SetStateAction<string>> }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Link.configure({
        openOnClick: false
      }),
      Placeholder.configure({
        placeholder: "Write your story...",
      })
    ],
    content: "Write your story..."
  })

  useEffect(() => {
    editor.on("update", () => {
      setContent(editor.getText())
    })

    return () => {
      editor.off("update")
    }
  }, [editor])

  const addLink = () => {
    const url = window.prompt("Enter a URL")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  return (
    <div className="mt-8 p-4 rounded-lg w-full mx-auto bg-white">
      <div className="flex flex-end gap-2 border-b-accent pb-2 mb-4">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm cursor-pointer ${editor.isActive("bold") ? "bg-primary text-white" : "bg-gray-100"}`}
        >B</button>

        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm cursor-pointer font-inter ${editor.isActive("italic") ? "bg-primary text-white" : "bg-gray-100"}`}
        >I</button>

        <button 
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1 rounded cursor-pointer bg-gray-100"
        ><BiUndo size={19} /></button>

        <button 
          onClick={() => editor.chain().focus().redo().run()}
          className="px-3 py-1 rounded cursor-pointer bg-gray-100"
        ><BiRedo size={19} /></button>

        <button
          onClick={addLink}
          className="px-3 py-1 rounded cursor-pointer bg-gray-100"
        >
          <FiLink size={19} />
        </button>
      </div>
      <EditorContent editor={editor} className="max-w-none rounded-lg"  />
    </div>
  )
}

export default TextEditor