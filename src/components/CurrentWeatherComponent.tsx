import React from 'react';
import dayjs from 'dayjs';
import { DEFAULT_CONFIG } from '../constants';
import { CurrentWeatherComponentProps } from '../types';

const CurrentWeatherComponent = ({ weatherData } : CurrentWeatherComponentProps) => {
  const isNightTime = dayjs().hour() <= DEFAULT_CONFIG.nightHour ? '' : '-n';
  const { temp: currentTemp, feels_like: feelsLike, temp_min: tempMin, temp_max: tempMax } = weatherData.data2.main;
  const weatherIcon = weatherData.data2.weather[0].id;
  return (
    <figure className="current-weather-card">
      <figcaption>
        <i className={`owf owf-5x owf-${weatherIcon}${isNightTime}`}></i>
        <h3>{weatherData.data2.weather[0].description}</h3>
        <hr />
        <h5>Current Temp.</h5>
        <p>{currentTemp} &deg;F</p>
        <h5>Feels Like</h5>
        <p>{feelsLike} &deg;F</p>
        <h5>Temp. Low</h5>
        <p>{tempMin} &deg;F</p>
        <h5>Temp. High</h5>
        <p>{tempMax} &deg;F</p>
      </figcaption>
    </figure>
  );
};

export default CurrentWeatherComponent;