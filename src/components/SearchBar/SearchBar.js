import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debounceTimeout = useRef(null);

  useEffect(() => {
  if (city.length > 2) {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5`;
        const response = await fetch(geoUrl);
        const data = await response.json();
        
        if (data.results) {
          // Filtra resultados duplicados pelo nome da cidade
          const uniqueCities = [];
          const seenNames = new Set();

          data.results.forEach(result => {
            const fullName = `${result.name}, ${result.admin1 || ''}, ${result.country}`;
            if (!seenNames.has(fullName)) {
              seenNames.add(fullName);
              uniqueCities.push(result);
            }
          });

          setSuggestions(uniqueCities);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  } else {
    setSuggestions([]);
    setShowSuggestions(false);
  }
}, [city]);

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => city.length > 2 && setShowSuggestions(true)}
        />
        <button onClick={() => handleSelectSuggestion({ name: city })}>Buscar</button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}
              {suggestion.admin1 && `, ${suggestion.admin1}`} {/* <-- Adiciona o estado/região */}
              , {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;