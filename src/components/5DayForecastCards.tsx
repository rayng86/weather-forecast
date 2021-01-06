import React from 'react';
import dayjs from 'dayjs';
import { calculateByMeasurementType, useNightTimeCloudIcon } from '../utils';
import { ForecastCardProps, OWMWeatherData, ForecastCardsProps } from '../types';

export const ForecastCard = ({ forecastData, measurementType } : ForecastCardProps) => {
  const weatherIcon = forecastData.weather[0].id;
  return (
    <div style={{ minWidth: '100px', color: 'white', backgroundColor: '#88b1b4', minHeight: '150px', padding: '15px' }}>
      <p>{dayjs(forecastData.dt_txt).format('ddd')}</p>
      <p><i className={`owf owf-2x owf-${weatherIcon}${useNightTimeCloudIcon}`}></i></p>
      <p style={{ fontSize: '16px'}}>{calculateByMeasurementType(measurementType, forecastData.main.temp)}</p>
      <p style={{ color: '#efefef', fontSize: '16px' }}>{calculateByMeasurementType(measurementType, forecastData.main.feels_like)}</p>
    </div>
  )
};

export const ForecastCards = ({ weatherData, measurementType } : ForecastCardsProps ) => {
  const daily5DayForecast = weatherData.data.list.filter(day => day.dt_txt.includes('18:00'));
  return (
    <>
      <h2 style={{ color: '#88b1b4'}}>Next 5-Day Forecast</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        {daily5DayForecast.map((forecastData: OWMWeatherData, index: number) => <ForecastCard key={index} forecastData={forecastData} measurementType={measurementType}  />)}
      </div>
    </>
  )
};