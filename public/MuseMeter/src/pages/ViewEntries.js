import React, { useEffect, useState } from 'react';
import '../styles/ViewEntries.css';

function ViewEntries() {
  const [entries, setEntries] = useState([]);
  const [sortOption, setSortOption] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);

  // Load entries on mount
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('musemeter_entries')) || [];
    setEntries(savedEntries);
  }, []);

  const saveEntries = (updated) => {
    setEntries(updated);
    localStorage.setItem('musemeter_entries', JSON.stringify(updated));
  };

  // Delete entry
  const handleDelete = (dateAdded) => {
    const updatedEntries = entries.filter((entry) => entry.dateAdded !== dateAdded);
    saveEntries(updatedEntries);
  };

  // Toggle favorite
  const handleFavorite = (dateAdded) => {
    const updatedEntries = entries.map((entry) =>
      entry.dateAdded === dateAdded
        ? { ...entry, isFavorite: !entry.isFavorite }
        : entry
    );
    saveEntries(updatedEntries);
  };

  // Sorting
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortOption === 'rating') {
      return Number(b.rating) - Number(a.rating);
    }
    return Number(b.dateAdded) - Number(a.dateAdded); // newest first
  });

  // Filtering
  const filteredEntries = sortedEntries.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.thoughts?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      entry.type?.toLowerCase() === filterType.toLowerCase();

    const matchesFavorite = !showFavorites || entry.isFavorite;

    return matchesSearch && matchesType && matchesFavorite;
  });

  //  Debug logs
  console.log("All entries from localStorage:", entries);
  console.log("After filtering:", filteredEntries);

  return (
    <div className="container mt-5">
      <h2>Your Entries</h2>

      {/* Controls */}
      <div className="row mb-4">
        {/* Search */}
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="book">Book</option>
            <option value="movie">Movie</option>
            <option value="poem">Poem</option>
            <option value="music">Music</option>
            <option value="theatre play">Theatre Play</option>
          </select>
        </div>

        {/* Sort */}
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Date Added</option>
            <option value="rating">Rating (High → Low)</option>
          </select>
        </div>

        {/* Show Favorites Toggle */}
        <div className="col-md-3 mb-2">
          <button
            className={`btn ${showFavorites ? 'btn-warning' : 'btn-outline-warning'} w-100`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? 'Show All' : 'Show Favorites ⭐'}
          </button>
        </div>
      </div>

      {/* Entries */}
      {filteredEntries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="row">
          {filteredEntries.map((entry) => (
            <div className="col-md-4 mb-4" key={entry.dateAdded}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {entry.title}{' '}
                    {entry.isFavorite && <span style={{ color: 'gold' }}>⭐</span>}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">{entry.displayType || entry.type}</h6>
                  <p><strong>Rating:</strong> {entry.rating}/5</p>
                  <p className="card-text">{entry.thoughts}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className={`btn btn-sm ${entry.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleFavorite(entry.dateAdded)}
                    >
                      {entry.isFavorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(entry.dateAdded)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewEntries;

