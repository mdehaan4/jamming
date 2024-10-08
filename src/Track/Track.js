// Track.js
import React from 'react';

const Track = ({ track, onAdd, onRemove }) => {
  return (
    <div className="Track">
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>
      {onAdd && <button onClick={() => onAdd(track)}>+</button>} {/* Add button */}
      {onRemove && <button onClick={() => onRemove(track)}>-</button>} {/* Remove button */}
    </div>
  );
};

export default Track;



