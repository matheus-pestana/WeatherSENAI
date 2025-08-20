// src/components/DataCards/DataCards.js
import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './DataCards.css';

const DataCards = ({ feelsLike, hourlyData }) => {
  return (
    <div className="data-cards-container">
      {/* Card da Sensação Térmica (mantém o mesmo) */}
      <div className="data-card">
        <span className="data-icon">🔥</span>
        <p>Sensação</p>
        <p className="data-value">{Math.round(feelsLike)}°C</p>
      </div>

      {/* Card do Gráfico de Temperatura (ajustado) */}
      <div className="data-card chart-card">
        <h4 className="chart-title">Temperatura/h</h4>
        {/* Aumente a altura de 100 para 150 ou 200 */}
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            {/* Exiba o eixo X e mude a cor para o branco */}
            <XAxis dataKey="time" stroke="#fff" /> 
            <Tooltip
              contentStyle={{ backgroundColor: '#444760', border: 'none', borderRadius: '5px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => `${Math.round(value)}°C`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#FFD700"
              strokeWidth={2}
              dot={{ r: 2, fill: '#FFD700' }} /* Adiciona pontos com raio 4 e cor amarela */
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataCards;