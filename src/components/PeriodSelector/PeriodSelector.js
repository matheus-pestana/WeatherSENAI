import React from 'react';
import './PeriodSelector.css';

const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { label: 'Agora', value: 'now' },
    { label: 'Hoje', value: 'today' },
    { label: 'Amanhã', value: 'tomorrow' },
    { label: 'Fim de semana', value: 'weekend' },
  ];

  return (
    <div className="period-selector-container">
      {periods.map((period) => (
        <button
          key={period.value}
          className={`period-selector-button ${selectedPeriod === period.value ? 'selected' : ''}`}
          onClick={() => onPeriodChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;