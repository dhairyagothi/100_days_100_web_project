import { RiDeleteBin6Line } from "react-icons/ri";

function NoteCard({ note, active, selectNote, deleteNote }) {
  return (
    <div className={ active ? "note-card active" : "note-card" } onClick={() => selectNote(note)}>
      <div className="note-header">
        <h3>{note.title}</h3>
        <button className="delete-btn" onClick={(e) => {
            e.stopPropagation();
            deleteNote(e, note._id);
          }}>
          <RiDeleteBin6Line />
        </button>
      </div>
      <p className="note-content" dangerouslySetInnerHTML={{
          __html: note.content
        }}
      ></p>
    </div>
  );
}

export default NoteCard;