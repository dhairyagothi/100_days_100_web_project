import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';

export default function Home() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('/api/notes', authHeader);
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post('/api/notes', form, authHeader);
      setNotes([res.data, ...notes]);
      setForm({ title: '', content: '' });
    } catch (err) {
      console.error('Failed to create note:', err.response?.data?.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));
  const handleUpdate = (updated) =>
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <h2 style={styles.heading}>Your Notes</h2>
          <span style={styles.count}>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Create note form */}
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            placeholder="Note title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
            maxLength={100}
          />
          <textarea
            placeholder="Write your note here..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            maxLength={5000}
          />
          <button type="submit" disabled={creating} style={styles.createBtn}>
            {creating ? '⏳ Saving...' : '+ Add Note'}
          </button>
        </form>

        {/* Search bar */}
        {notes.length > 0 && (
          <input
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...styles.input, marginBottom: '24px' }}
          />
        )}

        {/* Notes grid */}
        {loading ? (
          <div style={styles.emptyState}>⏳ Loading your notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div style={styles.emptyState}>
            {search ? '🔍 No notes match your search.' : '✨ No notes yet. Create your first one above!'}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#0a0a1a', minHeight: '90vh', padding: '32px 20px' },
  container: { maxWidth: '980px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { color: '#e94560', fontSize: '1.7rem', fontWeight: '700' },
  count: { background: '#1e1e4a', color: '#818cf8', padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', background: '#12122a', padding: '22px', borderRadius: '14px', border: '1px solid #1e1e4a' },
  input: { padding: '12px 16px', background: '#0a0a1a', border: '1px solid #1e3a6e', borderRadius: '10px', color: '#fff', fontSize: '0.97rem', width: '100%', boxSizing: 'border-box' },
  createBtn: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' },
  emptyState: { textAlign: 'center', color: '#4b5563', marginTop: '60px', fontSize: '1.05rem', lineHeight: '2' },
};
