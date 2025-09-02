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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [forecastStartIndex, setForecastStartIndex] = useState(0);

  const fetchWeather = async (latitude, longitude, cityName) => {
    setError(null);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m,windspeed_10m,apparent_temperature&hourly=temperature_2m,weathercode,apparent_temperature&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error('Falha ao buscar os dados da previsão.');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setCity(cityName || 'Sua Localização');
      setSelectedDayIndex(0);
      setForecastStartIndex(0); // Reseta a exibição ao buscar nova cidade
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

  const findNextSaturdayIndex = () => {
    const SATURDAY_DAY_CODE = 6;
    const saturdayIndex = weatherData.daily.time.findIndex(dateString => {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getDay() === SATURDAY_DAY_CODE;
    });
    return saturdayIndex === -1 ? 0 : saturdayIndex;
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    let newSelectedDayIndex = 0;
    let newForecastStartIndex = 0;

    switch (period) {
      case 'today':
        newSelectedDayIndex = 0;
        newForecastStartIndex = 0;
        break;
      case 'tomorrow':
        newSelectedDayIndex = 1;
        newForecastStartIndex = 0;
        break;
      case 'weekend':
        const saturdayIndex = findNextSaturdayIndex();
        newSelectedDayIndex = saturdayIndex;
        newForecastStartIndex = saturdayIndex;
        break;
      case '15-days':
      default:
        newSelectedDayIndex = 0;
        newForecastStartIndex = 0;
    }
    setSelectedDayIndex(newSelectedDayIndex);
    setForecastStartIndex(newForecastStartIndex);
  };

  const handleDayCardClick = (index) => {
    setSelectedDayIndex(index);
    setSelectedPeriod('other');
  };
  const getHourlyDataForSelectedDay = (dayIndex) => {
    if (!weatherData || !weatherData.hourly || !weatherData.hourly.time) {
      return [];
    }
    
    if (dayIndex === 0) {
      const now = new Date();

      let startIndex = weatherData.hourly.time.findIndex(timeString => new Date(timeString) >= now);

      if (startIndex === -1) {
        startIndex = Math.max(0, weatherData.hourly.time.length - 6);
      }
      
      const endIndex = startIndex + 6;
      
      return weatherData.hourly.time.slice(startIndex, endIndex).map((timeString, index) => {
        const date = new Date(timeString);
        const hourFromAPI = date.getUTCHours();
        const timezoneOffsetInHours = weatherData.utc_offset_seconds / 3600;
        const displayHour = (hourFromAPI + timezoneOffsetInHours + 24) % 24;

        const originalIndex = startIndex + index;

        return {
          time: `${Math.floor(displayHour)}h`,
          temp: weatherData.hourly.temperature_2m[originalIndex],
        };
      });

    } else {
      const hoursPerDay = 24;
      const startIndex = dayIndex * hoursPerDay;
      const endIndex = startIndex + 6;

      return weatherData.hourly.time.slice(startIndex, endIndex).map((timeString, index) => {
        const date = new Date(timeString);
        const hourFromAPI = date.getUTCHours();
        const timezoneOffsetInHours = weatherData.utc_offset_seconds / 3600;
        const displayHour = (hourFromAPI + timezoneOffsetInHours + 24) % 24;

        return {
          time: `${Math.floor(displayHour)}h`,
          temp: weatherData.hourly.temperature_2m[startIndex + index],
        };
      });
    }
  };

  const getDailyDataForSelectedDay = (dayIndex) => {
    if (dayIndex === 0) {
      return {
        temperature_2m: weatherData.current.temperature_2m,
        weathercode: weatherData.current.weathercode,
      };
    } else {
      return {
        temperature_2m: weatherData.daily.temperature_2m_max[dayIndex],
        weathercode: weatherData.daily.weathercode[dayIndex],
      };
    }
  };

  const getFeelsLikeForSelectedDay = (dayIndex) => {
    if (dayIndex === 0) {
      return weatherData.current.apparent_temperature;
    } else {
      return weatherData.daily.temperature_2m_max[dayIndex];
    }
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
                feelsLike={getFeelsLikeForSelectedDay(selectedDayIndex)}
                hourlyData={getHourlyDataForSelectedDay(selectedDayIndex)}
              />
            </div>
            <TodayWeather
              data={getDailyDataForSelectedDay(selectedDayIndex)}
              city={city}
            />
          </div>
          {selectedPeriod !== 'today' && selectedPeriod !== 'tomorrow' && (
            <div className="weekly-forecast-container">
              {weatherData.daily.time.slice(forecastStartIndex).map((day, relativeIndex) => {
                const originalIndex = forecastStartIndex + relativeIndex;
                return (
                  <WeatherCard
                    key={originalIndex}
                    day={getDayOfWeek(weatherData.daily.time[originalIndex])}
                    tempMax={weatherData.daily.temperature_2m_max[originalIndex]}
                    tempMin={weatherData.daily.temperature_2m_min[originalIndex]}
                    weatherCode={weatherData.daily.weathercode[originalIndex]}
                    onClick={() => handleDayCardClick(originalIndex)}
                    isSelected={originalIndex === selectedDayIndex}
                  />
                );
              })}
            </div>
          )}
          <ExtraInfo
            rainProb={weatherData.daily.precipitation_probability_max[selectedDayIndex]}
            sunrise={weatherData.daily.sunrise[selectedDayIndex]}
            sunset={weatherData.daily.sunset[selectedDayIndex]}
            tempMax={weatherData.daily.temperature_2m_max[selectedDayIndex]}
            tempMin={weatherData.daily.temperature_2m_min[selectedDayIndex]}
            uvIndex={weatherData.daily.uv_index_max[selectedDayIndex]}
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