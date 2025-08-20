import React from 'react';
import './WeatherCard.css';
import { getWeatherDescriptionAndIcon } from '../../utils/weatherUtils';

const WeatherCard = ({ day, tempMax, tempMin, weatherCode }) => {
  const { icon } = getWeatherDescriptionAndIcon(weatherCode);

  return (
    <div className="weather-card">
      <p className="day">{day}</p>
      <span className="weather-icon">{icon}</span>
      <p className="temp-range">
        <span className="temp-max">{Math.round(tempMax)}°</span>
        <span className="temp-min">{Math.round(tempMin)}°</span>
      </p>
    </div>
  );
};

export default WeatherCard;