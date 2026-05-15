import React, { useState, useEffect } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Pin, Edit2, Trash2, Plus, GripVertical, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import styles from './NotesSidebar.module.css';

export interface Note {
  id: string;
  text: string;
  startDate: string | null;
  endDate: string | null;
  isPinned: boolean;
}

export const NotesSidebar: React.FC<{
  currentMonth: Date;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onSetSelection: (start: Date | null, end: Date | null) => void;
}> = ({ currentMonth, selectionStart, selectionEnd, onSetSelection }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');
  
  const monthKey = `calendar-notes-${currentMonth.getMonth()}-${currentMonth.getFullYear()}`;

  useEffect(() => {
    const saved = localStorage.getItem(monthKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        } else {
          setNotes([{
            id: `migrate-${Date.now()}`,
            text: saved,
            startDate: null,
            endDate: null,
            isPinned: false
          }]);
        }
      } catch (e) {
        if (saved.trim()) {
           setNotes([{
             id: `migrate-${Date.now()}`,
             text: saved,
             startDate: null,
             endDate: null,
             isPinned: false
           }]);
        } else {
           setNotes([]);
        }
      }
    } else {
      setNotes([]);
    }
  }, [monthKey]);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem(monthKey, JSON.stringify(newNotes));
  };

  const handleAddNote = () => {
    setEditingId('new');
    setDraftText('');
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
    setDraftText(note.text);
    // When editing, reflect the note's dates in the calendar selection visually!
    onSetSelection(
      note.startDate ? new Date(note.startDate) : null,
      note.endDate ? new Date(note.endDate) : null
    );
  };

  const handleSaveNote = () => {
    if (!draftText.trim()) {
      handleCancelEdit();
      return;
    }

    if (editingId === 'new') {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        text: draftText,
        startDate: selectionStart ? selectionStart.toISOString() : null,
        endDate: selectionEnd ? selectionEnd.toISOString() : null,
        isPinned: false
      };
      saveNotes([...notes, newNote]);
    } else {
      const updatedNotes = notes.map(n => 
        n.id === editingId 
          ? { 
              ...n, 
              text: draftText,
              startDate: selectionStart ? selectionStart.toISOString() : null,
              endDate: selectionEnd ? selectionEnd.toISOString() : null,
            } 
          : n
      );
      saveNotes(updatedNotes);
    }
    setEditingId(null);
    setDraftText('');
    onSetSelection(null, null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftText('');
    onSetSelection(null, null);
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    const updatedNotes = notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    saveNotes(updatedNotes);
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  const handleReorderPinned = (reordered: Note[]) => {
    saveNotes([...reordered, ...unpinnedNotes]);
  };

  const handleReorderUnpinned = (reordered: Note[]) => {
    saveNotes([...pinnedNotes, ...reordered]);
  };

  const formatNoteDates = (start: string | null, end: string | null) => {
    if (!start) return 'No dates attached';
    const s = new Date(start);
    if (!end || new Date(start).getTime() === new Date(end).getTime()) return format(s, 'MMMM d');
    const e = new Date(end);
    return `${format(s, 'MMM d')} - ${format(e, 'MMM d')}`;
  };

  const renderDraftBox = () => (
    <div className={styles.editDraftBox}>
      <textarea
        autoFocus
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
        className={styles.editTextArea}
        placeholder="Enter note... (Highlight dates on calendar!)"
        rows={3}
      />
      <div className={styles.editDraftActions}>
        <span className={styles.editDatePreview}>
          {selectionStart 
            ? (selectionEnd && selectionStart.getTime() !== selectionEnd.getTime() 
                ? `${format(selectionStart, 'MMM d')} - ${format(selectionEnd, 'MMM d')}` 
                : format(selectionStart, 'MMM d')) 
            : 'No dates selected'}
        </span>
        <div className={styles.actionButtons}>
          <button onClick={handleCancelEdit} className={styles.iconBtn}><X size={16}/></button>
          <button onClick={handleSaveNote} className={styles.iconBtnSuccess}><Check size={16}/></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>
        <h4 className={styles.sidebarTitle}>Notes & Objectives</h4>
        <button onClick={handleAddNote} className={styles.addButton} title="New Note">
          <Plus size={18} />
        </button>
      </div>

      <div className={styles.notesWrapper}>
        <div className={styles.linedPaperEffect} />
        
        <div className={styles.notesListContainer}>
          
          {editingId === 'new' && renderDraftBox()}

          <Reorder.Group axis="y" values={pinnedNotes} onReorder={handleReorderPinned} className={styles.reorderGroup}>
            <AnimatePresence>
              {pinnedNotes.map((note) => (
                <Reorder.Item key={note.id} value={note} className={styles.noteItemBoxWrapper}>
                  {editingId === note.id ? renderDraftBox() : (
                    <div className={`${styles.noteItemBox} ${styles.pinned}`}>
                      <div className={styles.dragHandle} title="Drag to reorder"><GripVertical size={14}/></div>
                      <div className={styles.noteContent}>
                        <p className={styles.noteText}>{note.text}</p>
                        <span className={styles.noteDates}>{formatNoteDates(note.startDate, note.endDate)}</span>
                      </div>
                      <div className={styles.noteActions}>
                        <button onClick={() => togglePin(note.id)} className={`${styles.iconBtn} ${styles.activePin}`} title="Unpin from top"><Pin size={14} fill="currentColor" /></button>
                        <button onClick={() => handleEditNote(note)} className={styles.iconBtn} title="Edit note"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteNote(note.id)} className={styles.iconBtnDanger} title="Delete note"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && <div className={styles.pinnedDivider} />}

          <Reorder.Group axis="y" values={unpinnedNotes} onReorder={handleReorderUnpinned} className={styles.reorderGroup}>
            <AnimatePresence>
              {unpinnedNotes.map((note) => (
                <Reorder.Item key={note.id} value={note} className={styles.noteItemBoxWrapper}>
                  {editingId === note.id ? renderDraftBox() : (
                    <div className={styles.noteItemBox}>
                      <div className={styles.dragHandle} title="Drag to reorder"><GripVertical size={14}/></div>
                      <div className={styles.noteContent}>
                        <p className={styles.noteText}>{note.text}</p>
                        <span className={styles.noteDates}>{formatNoteDates(note.startDate, note.endDate)}</span>
                      </div>
                      <div className={styles.noteActions}>
                        <button onClick={() => togglePin(note.id)} className={styles.iconBtn} title="Pin to top"><Pin size={14} /></button>
                        <button onClick={() => handleEditNote(note)} className={styles.iconBtn} title="Edit note"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteNote(note.id)} className={styles.iconBtnDanger} title="Delete note"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
          
          {notes.length === 0 && editingId !== 'new' && (
            <div className={styles.emptyStateContainer}>
               <p className={styles.emptyStateText}>No notes yet.<br/>Click the + button or select dates on the calendar to begin!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};