import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './App.css'; // Importing styles for the App component
import SearchBar from './SearchBar/SearchBar'; // Importing SearchBar component
import SearchResults from './SearchResults/SearchResults'; // Importing SearchResults component
import Playlist from './Playlist/Playlist'; // Importing Playlist component
import logo from './logo.svg'; // Import the logo

// Define an array of track objects with unique IDs and mock URIs
const initialTracks = [
  {
    id: "1", // Unique ID
    name: "In Da Club",
    artist: "50 Cent",
    album: "Get Rich, Die Tryin'",
    uri: "spotify:track:1" // Mock URI
  },
  {
    id: "2", // Unique ID
    name: "Yeah",
    artist: "Usher",
    album: "Greatest Hits",
    uri: "spotify:track:2" // Mock URI
  },
  {
    id: "3", // Unique ID
    name: "Perfect",
    artist: "Ed Sheeran",
    album: "The X Album",
    uri: "spotify:track:3" // Mock URI
  }
];

function App() {
  const [tracks, setTracks] = useState(initialTracks); // Set initial state for tracks
  const [filteredTracks, setFilteredTracks] = useState(initialTracks); // State for filtered tracks
  const [playlistName, setPlaylistName] = useState("My Playlist"); // State for playlist name
  const [playlistTracks, setPlaylistTracks] = useState([]); // State for playlist tracks

  // State for OAuth tokens
  const [codeVerifier, setCodeVerifier] = useState('');
  const [codeChallenge, setCodeChallenge] = useState('');

  // Generate code verifier and code challenge
  useEffect(() => {
    const generateCodeVerifier = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
      let verifier = '';
      for (let i = 0; i < 128; i++) {
        verifier += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return verifier;
    };

    const base64UrlEncode = (buffer) => {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
        .replace(/\+/g, '-') // Replace '+' with '-'
        .replace(/\//g, '_') // Replace '/' with '_'
        .replace(/=+$/, ''); // Remove trailing '='
    };

    const generateCodeChallenge = async (verifier) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the code verifier
      return base64UrlEncode(hashBuffer); // Base64 URL encode the hash
    };

    const verifier = generateCodeVerifier();
    generateCodeChallenge(verifier).then(challenge => {
      setCodeVerifier(verifier);
      setCodeChallenge(challenge);
    });
  }, []);

  // Search function to filter tracks
  const handleSearch = (searchTerm) => {
    const filtered = tracks.filter(track => 
      track.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter by track name
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by artist name
    );
    setFilteredTracks(filtered); // Update the filtered tracks state
  };

  // Function to add a track to the playlist
  const addTrackToPlaylist = (track) => {
    if (!playlistTracks.find(t => t.id === track.id)) { // Avoid duplicates
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  // Function to remove a track from the playlist
  const removeTrackFromPlaylist = (track) => {
    const updatedPlaylist = playlistTracks.filter(t => t.id !== track.id); // Filter out the track to remove
    setPlaylistTracks(updatedPlaylist); // Update the playlist tracks
  };

  // Function to save the playlist
  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri); // Get URIs of the playlist tracks
    console.log('Saving playlist with URIs:', trackURIs); // Mock save action
    setPlaylistTracks([]); // Reset the playlist
    setPlaylistName(''); // Reset the playlist name
  };

  // Log the code verifier and challenge to see them
  console.log('Code Verifier:', codeVerifier);
  console.log('Code Challenge:', codeChallenge);

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" /> {/* Add logo here */}
      <h1>Jammming</h1> {/* Main title for the application */}
      <SearchBar onSearch={handleSearch} /> {/* Pass the handleSearch function to SearchBar */}
      <SearchResults 
        tracks={filteredTracks} 
        onAdd={addTrackToPlaylist} 
      /> {/* Pass the filtered tracks and add function to SearchResults */}
      <Playlist 
        playlistName={playlistName} 
        playlistTracks={playlistTracks} // Ensure this matches what Playlist expects
        setPlaylistTracks={setPlaylistTracks} 
        setPlaylistName={setPlaylistName} 
        onRemove={removeTrackFromPlaylist} // Pass the remove function to Playlist
        onSave={savePlaylist} // Pass the save function to Playlist
      /> {/* Pass playlist data to Playlist */}
    </div>
  );
}

export default App; // Exporting the App component

