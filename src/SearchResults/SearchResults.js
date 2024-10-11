import React from 'react';
import Track from '../Track/Track';
import './SearchResults.css';

const SearchResults = ({ searchResults, onAdd }) => { // Change `tracks` to `searchResults`
  if (!searchResults || searchResults.length === 0) { // Add check for undefined or empty searchResults
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <p>No results found. Please try a different search.</p>
      </div>
    );
  }

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <div>
        {searchResults.map(track => ( // Use searchResults instead of tracks
          <Track 
            key={track.id}
            track={track}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;





