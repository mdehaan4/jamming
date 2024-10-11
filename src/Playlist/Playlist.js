import React, { useState, useEffect } from 'react';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onRemove, onSave, onNameChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState(playlistName);

  useEffect(() => {
    setNewPlaylistName(playlistName);
  }, [playlistName]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNameChange(newPlaylistName);
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
            id="playlist-name-input" // Unique ID added
          />
        ) : (
          newPlaylistName
        )}
      </h2>

      {playlistTracks.length > 0 ? (
        playlistTracks.map(track => (
          <div key={track.id} className="track">
            <h3>{track.name}</h3>
            <p>{track.artist}</p>
            <p>{track.album}</p> {/* Added album information */}
            <button onClick={() => onRemove(track)}>Remove</button>
          </div>
        ))
      ) : (
        <p>No tracks in this playlist</p>
      )}

      <button onClick={onSave}>Export to Spotify</button>
    </div>
  );
}

export default Playlist;

