import { EditorContent } from "@tiptap/react";
import { useState } from "react";

import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaHeading } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";

function RichEditor({ editor, toolbarOnly }) {
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, h1: false, list: false });
  if (!editor) return null;
  if (toolbarOnly) {
    return (
      <div className="toolbar">

        <button type="button" className={ activeFormats.bold ? "toolbar-btn active" : "toolbar-btn" } onClick={() => {
            editor.chain().focus().toggleBold().run();
            setActiveFormats(prev => ({
              ...prev,
              bold: !prev.bold
            }));
          }}>
          <FaBold />
        </button>

        <button type="button" className={ activeFormats.italic ? "toolbar-btn active" : "toolbar-btn" } onClick={() => {
            editor.chain().focus().toggleItalic().run();
            setActiveFormats(prev => ({
              ...prev,
              italic: !prev.italic
            }));
          }}>
          <FaItalic />
        </button>

        <button type="button" className={ activeFormats.h1 ? "toolbar-btn active" : "toolbar-btn" } onClick={() => {
            editor.chain().focus().toggleHeading({
              level: 1
            }).run();
            setActiveFormats(prev => ({
              ...prev,
              h1: !prev.h1
            }));
          }}>
          <FaHeading />
        </button>

        <button type="button" className={ activeFormats.list ? "toolbar-btn active" : "toolbar-btn" } onClick={() => {
            editor.chain().focus().toggleBulletList().run();
            setActiveFormats(prev => ({
              ...prev,
              list: !prev.list
            }));
          }}>
          <FaListUl />
        </button>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <EditorContent editor={editor} className="tiptap-editor"/>
    </div>
  );
}

export default RichEditor;