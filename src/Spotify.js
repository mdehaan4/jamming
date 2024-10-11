const clientId = 'a7e8efd0f791462ebadff4357e4a021e'; // Replace with your Spotify client ID
const redirectUri = 'http://localhost:3000'; // Your redirect URI
let accessToken;
let userId;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');

    if (token) {
      accessToken = token;
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000); // Clear token after expiration
      window.history.pushState('Access Token', null, '/'); // Clean the URL
      return accessToken;
    } else {
      // If no token, redirect to Spotify authorization
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = authUrl;
    }
  },

  getUserInfo() {
    const token = this.getAccessToken();
    return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      return response.json();
    })
    .then(data => {
      userId = data.id; // Set userId from fetched data
      return data; // Return the data
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      throw error;
    });
  },

  search(term) {
    const token = this.getAccessToken();
    if (!token) {
      console.error('No access token found.');
      return Promise.reject('No access token found.');
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      return response.json();
    })
    .then((data) => {
      return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name, // Assuming the first artist is the main one
        album: track.album.name,
        uri: track.uri,
      }));
    })
    .catch((error) => {
      console.error('Error searching for tracks:', error);
      throw error;
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      console.error('Playlist name or track URIs missing.');
      return Promise.reject('Playlist name or track URIs missing.');
    }

    const token = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Create a new playlist
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ name: name, public: false }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      return response.json();
    })
    .then(data => {
      const playlistId = data.id;
      // Add tracks to the new playlist
      return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ uris: trackUris }),
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add tracks to playlist');
      }
      console.log('Tracks added to playlist successfully.');
    })
    .catch(error => {
      console.error('Error saving playlist:', error);
      throw error;
    });
  }
};

export default Spotify;


