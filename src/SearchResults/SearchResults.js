import React from 'react';
import Track from '../Track/Track';
import './SearchResults.css';

const SearchResults = ({ searchResults, onAdd }) => {
  // Check if searchResults is undefined or empty
  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <h3>No results found. Please try a different search.</h3>
      </div>
    );
  }

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <div>
        {searchResults.map((track, index) => (
          <React.Fragment key={track.id}>
            <Track 
              track={track}
              onAdd={onAdd}
            />
            {/* Add a line (divider) between tracks */}
            {index < searchResults.length - 1 && (
              <hr className="track-divider" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;






