import React from 'react';
import dayjs from 'dayjs';
import { useNightTimeCloudIcon } from '../utils';
import { WeatherDataProps, ForecastCardProps, OWMWeatherData } from '../types';

export const ForecastCard = ({ forecastData } : ForecastCardProps) => {
  const weatherIcon = forecastData.weather[0].id;
  return (
    <div style={{ border: '1px solid black', minHeight: '150px', padding: '15px' }}>
      <p>{dayjs(forecastData.dt_txt).format('ddd')}</p>
      <p><i className={`owf owf-5x owf-${weatherIcon}${useNightTimeCloudIcon}`}></i></p>
      <p>{forecastData.main.temp}</p>
      <p>{forecastData.main.feels_like}</p>
    </div>
  )
};

export const ForecastCards = ({ weatherData } : WeatherDataProps ) => {
  const daily5DayForecast = weatherData.data.list.filter(day => day.dt_txt.includes('18:00'));
  return (
    <div style={{ display: 'flex'}}>
      {daily5DayForecast.map((forecastData: OWMWeatherData, index: number) => <ForecastCard key={index} forecastData={forecastData} />)}
    </div>
  )
};