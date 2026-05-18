import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import RichEditor from "./RichEditor";
import { IoCaretBackOutline } from "react-icons/io5";

function Editor({ title, setTitle, content, setContent, setSelectedNote  }) {
  const editor = useEditor({
    extensions: [StarterKit], content, onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <main className="editor">
      <div className="editor-topbar">
        <div className="editor-left">
          <button className="back-btn" onClick={() => {
              setSelectedNote(null);
              setTitle("");
              setContent("");
            }}>
            <IoCaretBackOutline />
          </button>
          <input type="text" placeholder="Untitled" className="title-input" value={title} onChange={(e) => setTitle(e.target.value) } />
        </div>
        <RichEditor editor={editor} toolbarOnly={true} />
      </div>
      <RichEditor editor={editor} />
    </main>
  );
}

export default Editor;