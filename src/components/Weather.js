import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherByLocation = (latitude, longitude) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Falha ao buscar os dados da previsão do tempo.');
          }
          return response.json();
        })
        .then(data => {
          setWeatherData(data.current_weather);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Sucesso: a localização foi obtida.
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        },
        (err) => {
          // Erro: o usuário negou a permissão ou houve outro problema.
          console.error("Erro ao obter a localização: ", err);
          setLoading(false);
          setError("Não foi possível obter sua localização. Por favor, habilite a permissão.");
        }
      );
    } else {
      // O navegador não suporta a API de Geolocalização.
      setLoading(false);
      setError("Seu navegador não suporta a API de Geolocalização.");
    }
  }, []); // O array vazio garante que o efeito só rode uma vez, na montagem do componente.

  if (loading) {
    return <div className="weather-container loading">Carregando dados...</div>;
  }

  if (error) {
    return <div className="weather-container error">Erro: {error}</div>;
  }

  if (!weatherData) {
    return <div className="weather-container no-data">Dados não disponíveis.</div>;
  }

  // Se tudo deu certo, exibe os dados
  return (
    <div className="weather-container">
      <h2>Previsão do Tempo (sua localização)</h2>
      <p>Temperatura: <strong>{weatherData.temperature}°C</strong></p>
      <p>Velocidade do Vento: <strong>{weatherData.windspeed} km/h</strong></p>
      <p>Direção do Vento: <strong>{weatherData.winddirection}°</strong></p>
    </div>
  );
};

export default Weather;