import React from 'react';
import Track from '../Track/Track';
import './SearchResults.css';

const SearchResults = ({ tracks, onAdd }) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <div>
        {tracks.map(track => (
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




