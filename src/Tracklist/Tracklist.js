import React from 'react';
import './Tracklist.css';
import Track from './Track'; // Import the Track component

function Tracklist({ tracks }) { // Accept 'tracks' as a prop
  return (
    <div className="Tracklist">
      <h2>Track List</h2>
      {tracks && tracks.length > 0 ? ( // Check if tracks exist and have length
        tracks.map(track => (
          <Track key={track.id} track={track} /> // Use the Track component to render each track
        ))
      ) : (
        <p>No tracks available</p> // Message when no tracks are present
      )}
    </div>
  );
}

export default Tracklist; // Exporting Tracklist component



