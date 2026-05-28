import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function NoteCard({ note, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const authHeader = { Authorization: `Bearer ${user.token}` };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const res = await axios.put(
        `/api/notes/${note._id}`,
        { title, content },
        { headers: authHeader }
      );
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Update failed:', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${note._id}`, { headers: authHeader });
      onDelete(note._id);
    } catch (err) {
      console.error('Delete failed:', err.response?.data?.message);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  if (editing) {
    return (
      <div style={styles.card}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          placeholder="Note title..."
          maxLength={100}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, height: '100px', resize: 'vertical' }}
          placeholder="Note content..."
          maxLength={5000}
        />
        <div style={styles.row}>
          <button onClick={handleUpdate} disabled={loading} style={styles.saveBtn}>
            {loading ? 'Saving...' : '✅ Save'}
          </button>
          <button onClick={() => { setEditing(false); setTitle(note.title); setContent(note.content); }} style={styles.cancelBtn}>
            ✖ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{note.title}</h3>
      <p style={styles.content}>{note.content}</p>
      <div style={styles.footer}>
        <span style={styles.date}>🗓 {formatDate(note.createdAt)}</span>
        <div style={styles.row}>
          <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️</button>
          <button onClick={handleDelete} style={styles.deleteBtn}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #1e3a6e',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'border-color 0.2s ease',
  },
  title: { color: '#e94560', fontSize: '1.05rem', fontWeight: '600', wordBreak: 'break-word' },
  content: { color: '#cbd5e1', fontSize: '0.93rem', lineHeight: '1.65', wordBreak: 'break-word', flex: 1 },
  date: { color: '#4b5563', fontSize: '0.78rem' },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: '#0f1729',
    border: '1px solid #1e3a6e',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  row: { display: 'flex', gap: '8px' },
  editBtn: { padding: '6px 12px', background: '#1e3a6e', color: '#93c5fd', border: 'none', borderRadius: '6px', fontSize: '0.85rem' },
  deleteBtn: { padding: '6px 12px', background: '#3b1a1a', color: '#f87171', border: 'none', borderRadius: '6px', fontSize: '0.85rem' },
  saveBtn: { flex: 1, padding: '8px', background: '#166534', color: '#86efac', border: 'none', borderRadius: '6px', fontWeight: '500' },
  cancelBtn: { flex: 1, padding: '8px', background: '#374151', color: '#d1d5db', border: 'none', borderRadius: '6px', fontWeight: '500' },
};
