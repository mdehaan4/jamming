import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import './Track.css'; // Import your CSS file for styling

const Track = ({ track, onAdd, onRemove }) => {
  return (
    <div className="Track">
      <div className="track-info"> {/* Wrap track info in a div */}
        <h3>{track.name || 'Unknown Track'}</h3> {/* Fallback for track name */}
        <h4>{track.artist || 'Unknown Artist'}</h4> {/* Fallback for artist */}
        <p>{track.album || 'Unknown Album'}</p> {/* Fallback for album */}
      </div>

      <div className="track-buttons"> {/* Wrap buttons in a div for styling */}
        {onAdd && (
          <button
            onClick={() => onAdd(track)}
            aria-label={`Add ${track.name} to playlist`}
            className="add-button" // Optional class for styling
          >
            +
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(track)}
            aria-label={`Remove ${track.name} from playlist`}
            className="remove-button" // Optional class for styling
          >
            - 
          </button>
        )}
      </div>
    </div>
  );
};

// Adding prop types for validation
Track.propTypes = {
  track: PropTypes.shape({
    name: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string, // Made optional
  }).isRequired,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Track;
