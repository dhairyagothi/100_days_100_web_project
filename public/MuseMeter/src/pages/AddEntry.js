import React, { useState } from 'react';
import '../styles/AddEntry.css';

function AddEntry() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Book');
  const [customType, setCustomType] = useState('');
  const [rating, setRating] = useState('');
  const [thoughts, setThoughts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use custom type if "Other"
    const entryType = type === 'Other' && customType.trim() !== '' ? customType : type;

    const newEntry = {
      title,
      type: entryType.toLowerCase(),      // for filtering consistency
      displayType: entryType,             // for UI display
      rating,
      thoughts,
      isFavorite: false,                  // default false
      dateAdded: Date.now(),              // unique ID + sorting
    };

    // Get existing entries
    const savedEntries = JSON.parse(localStorage.getItem('musemeter_entries')) || [];
    // Add new entry at the start
    savedEntries.unshift(newEntry);
    // Save back to localStorage
    localStorage.setItem('musemeter_entries', JSON.stringify(savedEntries));

    // Reset form
    setTitle('');
    setType('Book');
    setCustomType('');
    setRating('');
    setThoughts('');

    alert('Entry added successfully!');
  };

  return (
    <div className="add-entry-container">
      <h2 className="text-center">Add a New Entry</h2>
      <form onSubmit={handleSubmit} className="add-entry-form">
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title (e.g. book, movie, song...)"
            required
          />
        </div>
        {/* Type */}
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Book</option>
            <option>Movie</option>
            <option>Poem</option>
            <option>Music</option>
            <option>Theatre Play</option>
          </select>
        </div>
        {/* Custom Type */}
        {type === 'Other' && (
          <div className="form-group">
            <label>Specify Type</label>
            <input
              type="text"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="e.g. Stand-up comedy, Short film"
              required
            />
          </div>
        )}
        {/* Rating */}
        <div className="form-group">
          <label>Rating (1–5)</label>
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        {/* Thoughts */}
        <div className="form-group">
          <label>Your Thoughts</label>
          <textarea
            rows="3"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Share your review or reflection..."
          ></textarea>
        </div>
        {/* Submit */}
        <button type="submit" className="submit-btn">
          Add Entry
        </button>
      </form>
    </div>
  );
}

export default AddEntry;
