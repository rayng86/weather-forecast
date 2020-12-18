import React from 'react';
import { degreeTextSymbol } from '../constants';
import { WeatherDataProps } from '../types';
import { useNightTimeCloudIcon } from '../utils';

const CurrentWeatherComponent = ({ weatherData } : WeatherDataProps) => {
  const { temp: currentTemp, feels_like: feelsLike, temp_min: tempMin, temp_max: tempMax } = weatherData.data2.main;
  const weatherIcon = weatherData.data2.weather[0].id;
  return (
    <figure className="current-weather-card">
      <figcaption>
        <i className={`owf owf-5x owf-${weatherIcon}${useNightTimeCloudIcon}`}></i>
        <hr />
        <h5>Current Temp.</h5>
        <h3>{weatherData.data2.weather[0].description}</h3>
        <p>{currentTemp} {degreeTextSymbol}</p>
        <h5>Feels Like</h5>
        <p>{feelsLike} {degreeTextSymbol}</p>
        <h5>Temp. Low</h5>
        <p>{tempMin} {degreeTextSymbol}</p>
        <h5>Temp. High</h5>
        <p>{tempMax} {degreeTextSymbol}</p>
      </figcaption>
    </figure>
  );
};

export default CurrentWeatherComponent;