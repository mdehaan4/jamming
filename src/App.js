import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';
import Spotify from './Spotify';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = Spotify.getAccessToken();
    if (token) {
      localStorage.setItem('accessToken', token);
      console.log('Access Token:', token);

      // Fetch user info after getting access token
      Spotify.getUserInfo()
        .then((data) => {
          setUsername(data.display_name);
          console.log('Spotify User Profile:', data);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    } else {
      const storedToken = localStorage.getItem('accessToken'); 
      if (storedToken) {
        console.warn('Using stored access token.');
      } else {
        console.warn('No access token available.');
      }
    }
  }, []); // Dependency array should be empty if there are no external dependencies.

  const search = useCallback((term) => {
    console.log('Search term:', term);
    if (!term) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    Spotify.search(term)
      .then((results) => {
        setSearchResults(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error during search:', error);
        setLoading(false);
      });
  }, []);

  const addTrack = useCallback((track) => {
    if (playlistTracks.some((savedTrack) => savedTrack.id === track.id)) return;
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  }, [playlistTracks]);

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) => prevTracks.filter((currentTrack) => currentTrack.id !== track.id));
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris)
      .then(() => {
        setPlaylistName('New Playlist'); // Reset playlist name after saving
        setPlaylistTracks([]); // Clear playlist tracks after saving
      })
      .catch((error) => {
        console.error('Error saving playlist:', error); 
      });
  }, [playlistName, playlistTracks]);

  return (
    <div className="App">
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>

      {username && (
        <div className="welcome-message">
          <p>Welcome, {username}!</p>
        </div>
      )}

      <SearchBar onSearch={search} />

      <div className="App-playlist-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
        )}
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={updatePlaylistName}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
};

export default App;
