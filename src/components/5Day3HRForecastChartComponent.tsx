import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Chart from 'chart.js';
import { WeatherChartComponentProps } from '../types';

const WeatherChartComponent = ({ weatherData } : WeatherChartComponentProps) => {
  useEffect(() => {
    const ctx = document.getElementById("5DayForecast3HRData");
    // @ts-ignore
    new Chart(ctx, {
      type: "line",
      data: {
        labels: weatherData.list.map(n => {
          dayjs.extend(utc);
          const a = dayjs.utc(n.dt_txt);
          return a.local().format('h:mm A (MM/DD)');
          
        }),
        datasets: [
          {
            label: "Temperature (Fahrenheit)",
            data: weatherData.list.map(n => n.main.temp),
            backgroundColor: "#a0c1b9",
            fill: false,
            borderWidth: 1,
            borderColor: '#a0c1b9',
          }
        ]
      }
    });
  });
  return (
    <canvas id="5DayForecast3HRData" width="100%" height="100%" />
  );
};

export default WeatherChartComponent;