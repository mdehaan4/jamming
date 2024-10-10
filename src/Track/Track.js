// Track.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const Track = ({ track, onAdd, onRemove }) => {
  return (
    <div className="Track">
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album || 'Unknown Album'}</p> {/* Fallback for album */}
      {onAdd && (
        <button onClick={() => onAdd(track)} aria-label={`Add ${track.name} to playlist`}>
          +
        </button>
      )} {/* Add button */}
      {onRemove && (
        <button onClick={() => onRemove(track)} aria-label={`Remove ${track.name} from playlist`}>
          - 
        </button>
      )} {/* Remove button */}
    </div>
  );
};

// Adding prop types for validation
Track.propTypes = {
  track: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string, // Made optional
  }).isRequired,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Track;





