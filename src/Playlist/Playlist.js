import React, { useState, useEffect } from 'react'; // Import useEffect for handling updates
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, setPlaylistTracks, setPlaylistName, onRemove, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState(playlistName);

  // Effect to synchronize playlist name when the prop changes
  useEffect(() => {
    setNewPlaylistName(playlistName);
  }, [playlistName]);

  // Function to handle when the playlist title is clicked
  const handleTitleClick = () => {
    setIsEditing(true);
  };

  // Function to handle input change for playlist name
  const handleInputChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  // Function to handle input blur (when user clicks away)
  const handleBlur = () => {
    setIsEditing(false);
    setPlaylistName(newPlaylistName); // Update the playlist name in the parent component
  };

  return (
    <div className="Playlist">
      <h2 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        {isEditing ? (
          <input 
            type="text" 
            value={newPlaylistName} 
            onChange={handleInputChange} 
            onBlur={handleBlur} 
            autoFocus 
          />
        ) : (
          newPlaylistName
        )}
      </h2>

      {/* Displaying tracks in the playlist */}
      {playlistTracks.length > 0 ? (
        playlistTracks.map(track => (
          <div key={track.id} className="track"> {/* Each track with a unique key */}
            <h3>{track.name}</h3> {/* Display track name */}
            <p>{track.artist}</p> {/* Display artist name */}
            <button onClick={() => onRemove(track)}>Remove</button> {/* Remove button passing the track object */}
          </div>
        ))
      ) : (
        <p>No tracks in this playlist</p> // Message when no tracks are present
      )}

      {/* Button to save the playlist */}
      <button onClick={onSave}>Export to Spotify</button> {/* Call onSave when clicked */}
    </div>
  );
}

export default Playlist;

