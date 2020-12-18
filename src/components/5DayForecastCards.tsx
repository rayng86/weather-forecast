import React from 'react';
import dayjs from 'dayjs';
import { useNightTimeCloudIcon } from '../utils';
import { WeatherDataProps, ForecastCardProps, OWMWeatherData } from '../types';
import { degreeTextSymbol } from '../constants';

export const ForecastCard = ({ forecastData } : ForecastCardProps) => {
  const weatherIcon = forecastData.weather[0].id;
  return (
    <div style={{ color: 'white', backgroundColor: '#88b1b4', minHeight: '150px', padding: '15px' }}>
      <p>{dayjs(forecastData.dt_txt).format('ddd')}</p>
      <p><i className={`owf owf-2x owf-${weatherIcon}${useNightTimeCloudIcon}`}></i></p>
      <p>{forecastData.main.temp}{degreeTextSymbol}</p>
      <p style={{ color: '#efefef' }}>{forecastData.main.feels_like}{degreeTextSymbol}</p>
    </div>
  )
};

export const ForecastCards = ({ weatherData } : WeatherDataProps ) => {
  const daily5DayForecast = weatherData.data.list.filter(day => day.dt_txt.includes('18:00'));
  return (
    <>
      <h2 style={{ color: '#88b1b4'}}>Next 5-Day Forecast</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {daily5DayForecast.map((forecastData: OWMWeatherData, index: number) => <ForecastCard key={index} forecastData={forecastData} />)}
      </div>
    </>
  )
};