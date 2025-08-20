import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import TodayWeather from './components/TodayWeather/TodayWeather';
import WeatherCard from './components/WeatherCard/WeatherCard';
import DataCards from './components/DataCards/DataCards';
import ExtraInfo from './components/ExtraInfo/ExtraInfo';
import PeriodSelector from './components/PeriodSelector/PeriodSelector';
import { getDayOfWeek } from './utils/weatherUtils';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Sua Localização");
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const fetchWeather = async (latitude, longitude, cityName) => {
    setError(null);
    try {
      // Solicita as variáveis horárias e diárias explicitamente
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m,windspeed_10m,apparent_temperature&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error('Falha ao buscar os dados da previsão.');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setCity(cityName || 'Sua Localização');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const cityName = await fetchCityNameFromCoords(position.coords.latitude, position.coords.longitude);
          // A chamada para fetchWeather já lida com o estado de loading
          fetchWeather(position.coords.latitude, position.coords.longitude, cityName);
        },
        (err) => {
          console.error("Erro ao obter a localização: ", err);
          setError("Não foi possível obter sua localização. Por favor, pesquise uma cidade.");
          setLoading(false); // Desativa o loading em caso de erro
        }
      );
    } else {
      setError("Seu navegador não suporta a API de Geolocalização.");
      setLoading(false); // Desativa o loading se a geolocalização não estiver disponível
    }
  }, []);

  const fetchCityBySearch = async (cityName) => {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        fetchWeather(latitude, longitude, cityName);
      } else {
        setError("Cidade não encontrada.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erro ao buscar a cidade.");
      setLoading(false);
    }
  };

  const fetchCityNameFromCoords = async (latitude, longitude) => {
    try {
      // API de geocodificação reversa
      const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(reverseGeoUrl);
      const data = await response.json();

      const cityName = data.address?.city || data.address?.town || data.address?.village || "Sua Localização";
      return cityName;

    } catch (err) {
      console.error("Erro ao obter o nome da cidade:", err);
      return "Sua Localização";
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const cityName = await fetchCityNameFromCoords(position.coords.latitude, position.coords.longitude);
          fetchWeather(position.coords.latitude, position.coords.longitude, cityName);
        },
        (err) => {
          console.error("Erro ao obter a localização: ", err);
          setError("Não foi possível obter sua localização. Por favor, pesquise uma cidade.");
          setLoading(false);
        }
      );
    } else {
      setError("Seu navegador não suporta a API de Geolocalização.");
      setLoading(false);
    }
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Aqui você faria a chamada à API com base no período
    // fetchWeatherData(period);
  };


  return (
    <div className="app-container">
      {loading ? (
        <p className="loading-message">Carregando...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : weatherData ? (
        <>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
          <div className="main-content">
            <div className="search">
              <SearchBar onSearch={fetchCityBySearch} />
              <DataCards
                feelsLike={weatherData.current.apparent_temperature}
                hourlyData={weatherData.hourly.time.slice(0, 10).map((time, index) => ({
                  time: new Date(time).getHours() + 'h',
                  temp: weatherData.hourly.temperature_2m[index],
                }))}
              />
            </div>
            <TodayWeather data={weatherData.current} city={city} />
          </div>
          <div className="weekly-forecast-container">
            {weatherData.daily.time.slice(0, 5).map((day, index) => (
              <WeatherCard
                key={index}
                day={getDayOfWeek(day)}
                tempMax={weatherData.daily.temperature_2m_max[index]}
                tempMin={weatherData.daily.temperature_2m_min[index]}
                weatherCode={weatherData.daily.weathercode[index]}
              />
            ))}
          </div>
          <ExtraInfo
            rainProb={weatherData.daily.precipitation_probability_max[0]}
            sunrise={weatherData.daily.sunrise[0]}
            sunset={weatherData.daily.sunset[0]}
            tempMax={weatherData.daily.temperature_2m_max[0]}
            tempMin={weatherData.daily.temperature_2m_min[0]}
            uvIndex={weatherData.daily.uv_index_max[0]}
            humidity={weatherData.current.relativehumidity_2m}
          />
        </>
      ) : (
        <p className="no-data-message">Nenhum dado de previsão disponível.</p>
      )}
    </div>
  );
};

export default App;