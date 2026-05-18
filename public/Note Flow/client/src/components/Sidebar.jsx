import NotesList from "./NotesList";

import { FaPlus } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";


function Sidebar({ notes, selectedNote, selectNote, deleteNote, search, setSearch, darkMode, setDarkMode, newNote }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Notes</h2>

        <div className="header-actions">
          <button id="themeToggle" onClick={() => setDarkMode(!darkMode)}>
            <FaMoon />
          </button>
          <button id="saveBtn" onClick={newNote}>
            <FaPlus />
          </button>
        </div>

      </div>
      <div className="search-wrapper">
        <input type="text" placeholder="Search..." className="search" value={search} onChange={(e) => setSearch(e.target.value) }/>
      </div>

      <NotesList
        notes={notes}
        selectedNote={selectedNote}
        selectNote={selectNote}
        deleteNote={deleteNote}
      />

      <div className="sidebar-footer">
        <p>
          Built by
          <span className="footer-name">{" "}Anurag Kumar</span>
        </p>
        <div className="footer-links">
          <a href="https://github.com/Anurag-3112/" target="_blank" rel="noreferrer">
            Github
          </a>
          <span>|</span>
          <a href="https://linkedin.com/in/anurag-kumar-work/" target="_blank" rel="noreferrer">
            Linkedin
          </a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;