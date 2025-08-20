import React from 'react';
import './TodayWeather.css';
import { getWeatherDescriptionAndIcon } from '../../utils/weatherUtils';

const TodayWeather = ({ data, city }) => {
  if (!data) return null;

  const { description, icon } = getWeatherDescriptionAndIcon(data.weathercode);

  return (
    <div className="today-weather-card">
      <p className="city-name">{city}</p>
      <div className="weather-info">
        <span className="weather-icon">{icon}</span>
        <span className="weather-description">{description}</span>
      </div>
      <p className="temperature">{data.temperature_2m}°</p>
    </div>
  );
};

export default TodayWeather;