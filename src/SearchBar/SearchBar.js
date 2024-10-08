import React, { useState } from 'react';
import './SearchBar.css'; // Make sure you have this file for styling

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update state with input value
  };

  const handleSearch = () => {
    onSearch(searchTerm); // Call the onSearch function passed from App.js
    setSearchTerm(''); // Clear the input after searching
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Perform search on Enter key press
    }
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a song or artist..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar; // Exporting SearchBar component



