import React from 'react';
import './ExtraInfo.css';

const ExtraInfo = ({ rainProb, sunrise, sunset, tempMax, tempMin, uvIndex, humidity }) => {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="extra-info-container">
      <div className="extra-info-item">
        <span className="extra-info-icon">☔</span>
        <p>Prob. de Chuva</p>
        <p className="extra-info-value">{rainProb}%</p>
      </div>
      <div className="extra-info-item">
        <span className="extra-info-icon">☀️</span>
        <p>Nascer do Sol</p>
        <p className="extra-info-value">{formatTime(sunrise)}</p>
      </div>
      <div className="extra-info-item">
        <span className="extra-info-icon">🌡️</span>
        <p>Máx / Mín</p>
        <p className="extra-info-value">{Math.round(tempMax)}° / {Math.round(tempMin)}°</p>
      </div>
      <div className="extra-info-item">
        <span className="extra-info-icon">💧</span>
        <p>Umidade</p>
        <p className="extra-info-value">{humidity}%</p>
      </div>
      <div className="extra-info-item">
        <span className="extra-info-icon">🌙</span>
        <p>Pôr do Sol</p>
        <p className="extra-info-value">{formatTime(sunset)}</p>
      </div>
      <div className="extra-info-item">
        <span className="extra-info-icon">🌞</span>
        <p>Índice UV</p>
        <p className="extra-info-value">{uvIndex}</p>
      </div>
    </div>
  );
};

export default ExtraInfo;