import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Chart from 'chart.js';
import { WeatherChartComponentProps } from '../types';
import { degreeTextSymbol } from '../constants';
import { calculateByMeasurementType } from '../utils';

const WeatherChartComponent = ({ weatherData, measurementType } : WeatherChartComponentProps) => {
  useEffect(() => {
    const ctx = document.getElementById("5DayForecast3HRData") as HTMLCanvasElement;
    const chartLabels = weatherData.list.map(n => {
      dayjs.extend(utc);
      const a = dayjs.utc(n.dt_txt);
      return a.local().format('h:mm A (MM/DD)');
      
    });
    const tempArr: any = weatherData.list.map(n => calculateByMeasurementType(measurementType, n.main.temp, true));
    const feelsLikeArr: any = weatherData.list.map(n => calculateByMeasurementType(measurementType, n.main.feels_like, true));
    const humidityArr: any = weatherData.list.map(n => n.main.humidity);
    new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: `Temperature (${degreeTextSymbol}${measurementType})`,
            data: tempArr,
            backgroundColor: "#5A5DA0",
            fill: false,
            borderWidth: 1,
            borderColor: '#5A5DA0',
            yAxisID: 'temperature'
          },
          {
            label: "Feels Like",
            data: feelsLikeArr,
            backgroundColor: "#da917b",
            fill: false,
            borderWidth: 1,
            borderColor: '#da917b',
            yAxisID: 'temperature'
          },
          {
            label: "Humidity",
            data: humidityArr,
            backgroundColor: "#EFAD10",
            fill: false,
            borderWidth: 1,
            borderColor: '#EFAD10',
            yAxisID: 'percent'
          }
        ]
      },
      options: {
        events: ['click'],
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
              labelString: `Temperature (${degreeTextSymbol}${measurementType})`,

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
  }, [measurementType, weatherData]);
  return (
    <canvas id="5DayForecast3HRData" width="100%" height="100%" />
  );
};

export default WeatherChartComponent;