import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { getNotes, createNote, updateNote, deleteNote } from "./services/notesApi";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const selectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const newNote = async () => {
    try {
      const noteData = {
        title: "Untitled",
        content: "<p></p>"
      };
      const created = await createNote(noteData);
      setSelectedNote(created);
      setTitle(created.title);
      setContent(created.content);
      loadNotes();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedNote) return;
    const timeout = setTimeout(async () => {
      try {
        const noteData = {
          title: title || "Untitled",
          content: content || "<p></p>"
        };
        await updateNote( selectedNote._id, noteData );
        loadNotes();
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, content]);

  const handleDelete = async (e, id) => {
    try {
      e.stopPropagation();
      await deleteNote(id);
      if (selectedNote?._id === id) {
        setSelectedNote(null);
        setTitle("");
        setContent("");
      }
      await loadNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredNotes = notes.filter(note => {
    return (
      note.title
        .toLowerCase()
        .includes(search.toLowerCase())
      ||
      note.content
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });


  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Sidebar
        notes={filteredNotes}
        selectedNote={selectedNote}
        selectNote={selectNote}
        deleteNote={handleDelete}
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        newNote={newNote}
      />
      {
        !selectedNote && (
          <div className="empty-state">
            <h1>Select a note</h1>
            <p>
              Choose a note or create a new one
            </p>
          </div>
        )
      }
      {
        selectedNote && (
          <Editor
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            setSelectedNote={setSelectedNote}
            setTitleState={setTitle}
            setContentState={setContent}
          />
        )
      }
    </div>
  );
}

export default App;