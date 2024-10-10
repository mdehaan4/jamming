const clientId = 'a7e8efd0f791462ebadff4357e4a021e'; // Replace with your Spotify app client ID
const redirectUri = 'http://localhost:3000'; // Redirect URI (should match the one in your Spotify dashboard)
let accessToken;

const Spotify = {
  getAccessToken() {
    // Check if access token is already stored
    if (accessToken) {
      console.log('Access Token:', accessToken); // Log the access token
      return accessToken;
    }

    // Check for an access token in the URL
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear the access token after it expires
      window.setTimeout(() => {
        accessToken = ''; // Clear token after expiration
        console.warn('Access token has expired.'); // Log token expiry
      }, expiresIn * 1000);
      
      // Remove the token from the URL to clean it up
      window.history.pushState('Access Token', null, '/');
      
      console.log('Access Token:', accessToken); // Log the access token
      return accessToken;
    } else {
      // Redirect to Spotify authorization
      const scopes = 'playlist-modify-public playlist-modify-private user-read-private'; // Added scope for private playlists
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location = accessUrl; // Redirect the user to the authorization page
    }
  },

  // Function to fetch user data
  getUserInfo() {
    const token = this.getAccessToken(); // Get the access token
    return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user info'); // Throw error on failure
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      throw error; // Rethrow the error for further handling if needed
    });
  },

  // Add the search method to interact with the Spotify API
  search(term) {
    const token = this.getAccessToken();
    console.log('Access Token in search:', token); // Log access token for debugging
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        // Check if response is okay
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonResponse => {
        // Check if the expected structure is present
        if (jsonResponse.tracks && jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist', // Safe access with fallback
            album: track.album.name,
            uri: track.uri
          }));
        } else {
          console.warn('No tracks found in response:', jsonResponse); // Debug info
          return []; // Return empty array if no tracks found
        }
      })
      .catch(error => {
        console.error('Error in search function:', error); // Catch any errors
        throw error; // Rethrow error for further handling
      });
  }
};

export default Spotify;

