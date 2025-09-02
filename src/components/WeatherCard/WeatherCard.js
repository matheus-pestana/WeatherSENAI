// DEPOIS (COM A MELHORIA) ✅
import React from 'react';
import './WeatherCard.css';
import { getWeatherDescriptionAndIcon } from '../../utils/weatherUtils';

// 1. Receba a prop 'isSelected'
const WeatherCard = ({ day, tempMax, tempMin, weatherCode, onClick, isSelected }) => {
  const { icon } = getWeatherDescriptionAndIcon(weatherCode);

  // 2. Crie uma classe dinâmica baseada na prop
  const cardClassName = `weather-card ${isSelected ? 'selected' : ''}`;

  return (
    // 3. Use a nova variável de classe
    <div className={cardClassName} onClick={onClick}>
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