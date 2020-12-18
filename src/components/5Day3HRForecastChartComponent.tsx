import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Chart from 'chart.js';
import { WeatherChartComponentProps } from '../types';
import { degreeTextSymbol } from '../constants';

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
            label: `Temperature ( ${degreeTextSymbol}F )`,
            data: weatherData.list.map(n => n.main.temp),
            backgroundColor: "#5A5DA0",
            fill: false,
            borderWidth: 1,
            borderColor: '#5A5DA0',
            yAxisID: 'temperature'
          },
          {
            label: "Feels Like",
            data: weatherData.list.map(n => n.main.feels_like),
            backgroundColor: "#da917b",
            fill: false,
            borderWidth: 1,
            borderColor: '#da917b',
            yAxisID: 'temperature'
          },
          {
            label: "Humidity",
            data: weatherData.list.map(n => n.main.humidity),
            backgroundColor: "#EFAD10",
            fill: false,
            borderWidth: 1,
            borderColor: '#EFAD10',
            yAxisID: 'percent'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            id: 'time-and-date',
            scaleLabel: {
              display: true,
              labelString: 'Time and Date',
            }
          }],
          yAxes: [{
            id: 'temperature',
            type: 'linear',
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: `Temperature ( ${degreeTextSymbol}F )`,

            },
            ticks: {
              callback: (tick: number) => Math.round(tick),
            }
          }, {
            id: 'percent',
            type: 'linear',
            gridLines: {
              display: false
            },
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: '%',
            },
          }]
        }
			},
    });
  });
  return (
    <canvas id="5DayForecast3HRData" width="100%" height="100%" />
  );
};

export default WeatherChartComponent;