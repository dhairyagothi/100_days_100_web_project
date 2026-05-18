import NoteCard from "./NoteCard";

function NotesList({ notes, selectedNote, selectNote, deleteNote }) {
  return (
    <div className="notes-list">
      {notes.map(note => (
        <NoteCard
          key={note._id}
          note={note}
          active={
            selectedNote?._id === note._id
          }
          selectNote={selectNote}
          deleteNote={deleteNote}
        />
      ))}
    </div>
  );
}

export default NotesList;