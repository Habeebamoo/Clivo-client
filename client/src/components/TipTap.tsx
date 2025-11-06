import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
import { useMemo } from "react";

const TipTap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "hj"
  });

  const providerValue = useMemo(() => ({ editor }), [editor])

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </EditorContext.Provider>
  )
}

export default TipTap