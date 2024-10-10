import React, { useState, useEffect } from 'react';
import './App.css'; // Importing styles for the App component
import SearchBar from './SearchBar/SearchBar'; // Importing SearchBar component
import SearchResults from './SearchResults/SearchResults'; // Importing SearchResults component
import Playlist from './Playlist/Playlist'; // Importing Playlist component
import logo from './logo.svg'; // Import the logo
import Spotify from './Spotify'; // Importing Spotify.js

function App() {
  const [tracks, setTracks] = useState([]); // Set initial state for tracks (empty, as we're fetching data)
  const [filteredTracks, setFilteredTracks] = useState([]); // State for filtered tracks
  const [playlistName, setPlaylistName] = useState("My Playlist"); // State for playlist name
  const [playlistTracks, setPlaylistTracks] = useState([]); // State for playlist tracks
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [accessToken, setAccessToken] = useState(''); // State for access token

  // Hardcoded tracks for testing
  const hardcodedTracks = [
    { id: '1', name: 'In Da Club', artist: '50 Cent', album: 'Get Rich or Die Tryin\'', uri: 'spotify:track:1' },
    { id: '2', name: 'Yeah', artist: 'Usher', album: 'Confessions', uri: 'spotify:track:2' },
    { id: '3', name: 'Perfect', artist: 'Ed Sheeran', album: 'The X', uri: 'spotify:track:3' }
  ];

  // UseEffect to get Spotify Access Token
  useEffect(() => {
    const token = Spotify.getAccessToken(); // Get the access token
    setAccessToken(token); // Store the access token
    console.log('Access Token:', token); // Log the access token
    setFilteredTracks(hardcodedTracks); // Set the hardcoded tracks as the initial state for filtered tracks
  }, []); // This will only run once when the component mounts

  // Fetch User's Spotify ID
  const fetchUserId = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the stored access token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user ID');
      }

      const data = await response.json();
      return data.id; // Return the user ID
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Search function to fetch tracks from Spotify API
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredTracks(hardcodedTracks); // Reset to hardcoded tracks if no search term
      return;
    }

    setLoading(true); // Optional: Set loading state

    Spotify.search(searchTerm)
      .then((response) => {
        console.log('Response from Spotify:', response); // Log the raw response for debugging

        // Check if the response has the expected structure
        if (response && Array.isArray(response)) {
          const tracks = response; // Set the received tracks directly
          if (tracks.length === 0) {
            console.warn('No tracks found for the search term:', searchTerm);
            setFilteredTracks(hardcodedTracks); // Reset to hardcoded tracks if no results
            return;
          }

          // Format the tracks received from the API
          const formattedTracks = tracks.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists && track.artists.length > 0 ? track.artists[0].name : 'Unknown Artist', // Ensure to access the first artist
            album: track.album ? track.album.name : 'Unknown Album', // Check for album existence
            uri: track.uri
          }));

          setFilteredTracks(formattedTracks); // Update the filtered tracks state
        } else {
          console.error('Unexpected response structure:', response); // Log unexpected structure
          setFilteredTracks(hardcodedTracks); // Reset to hardcoded tracks on error
        }
      })
      .catch((error) => {
        console.error('Error fetching tracks from Spotify:', error);
        setFilteredTracks(hardcodedTracks); // Reset to hardcoded tracks on error
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after fetching
      });
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
  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map(track => track.uri); // Get URIs of the playlist tracks
    console.log('Saving playlist with URIs:', trackURIs); // Log the URIs being saved
    console.log('Playlist Name:', playlistName); // Log playlist name

    try {
      const userId = await fetchUserId(); // Fetch user ID
      console.log('User ID:', userId); // Log user ID
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      // Create a new playlist using the user ID
      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the stored access token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName || 'New Playlist', // Fallback to default name if empty
          description: 'My custom playlist created from Jammming',
          public: false, // Set to false if you want the playlist to be private
        }),
      });

      if (!createPlaylistResponse.ok) {
        const errorResponse = await createPlaylistResponse.json(); // Log error details
        console.error('Error creating playlist:', errorResponse);
        throw new Error('Failed to create playlist');
      }

      const playlistData = await createPlaylistResponse.json(); // Get the new playlist data
      const playlistId = playlistData.id; // Get the new playlist ID

      // Add tracks to the playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the stored access token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackURIs, // Track URIs to add
        }),
      });

      if (!addTracksResponse.ok) {
        const errorResponse = await addTracksResponse.json(); // Log error details
        console.error('Error adding tracks to playlist:', errorResponse);
        throw new Error('Failed to add tracks to playlist');
      }

      console.log('Playlist saved to Spotify successfully!'); // Log success
      // Reset the playlist here
      setPlaylistTracks([]); // Clear the current playlist
      setPlaylistName(''); // Reset playlist name
    } catch (error) {
      console.error('Error saving playlist:', error.message || error); // Log any errors
    }
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" /> {/* Add logo here */}
      <h1>Jammming</h1> {/* Main title for the application */}
      <SearchBar onSearch={handleSearch} /> {/* Pass the handleSearch function to SearchBar */}
      {loading ? ( // Display loading indicator while fetching
        <p>Loading...</p>
      ) : (
        <SearchResults 
          tracks={filteredTracks} 
          onAdd={addTrackToPlaylist} 
        /> // Pass the filtered tracks and add function to SearchResults
      )}
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

