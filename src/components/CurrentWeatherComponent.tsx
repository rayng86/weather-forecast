import dayjs from 'dayjs';
import React from 'react';
import { CurrentWeatherComponentProps } from '../types';
import { calculateByMeasurementType, useNightTimeCloudIcon } from '../utils';

const CurrentWeatherComponent = ({
  weatherData,
  measurementType,
}: CurrentWeatherComponentProps) => {
  const todayDate = dayjs().format('MM/DD/YY h:mm A');
  const {
    temp: currentTemp,
    feels_like: feelsLike,
    temp_min: tempMin,
    temp_max: tempMax,
  } = weatherData.data2.main;
  const weatherIcon = weatherData.data2.weather[0].id;
  const { name: locationName } = weatherData.data2;
  return (
    <figure className="current-weather-card">
      <figcaption>
        <p>{todayDate}</p>
        <h2>{locationName}</h2>
        <i
          className={`owf owf-5x owf-${weatherIcon}${useNightTimeCloudIcon}`}
        ></i>
        <h3>{weatherData.data2.weather[0].description}</h3>
        <hr />
        <h5>Current Temp.</h5>
        <p>{calculateByMeasurementType(measurementType, currentTemp)}</p>
        <h5>Feels Like</h5>
        <p>{calculateByMeasurementType(measurementType, feelsLike)}</p>
        <h5>Temp. Low</h5>
        <p>{calculateByMeasurementType(measurementType, tempMin)}</p>
        <h5>Temp. High</h5>
        <p>{calculateByMeasurementType(measurementType, tempMax)}</p>
      </figcaption>
      <figcaption>
        <p>
          <small>Created by Raymond Ng</small>
        </p>
        <p>
          <small>
            Built With: Javascript, React, TypeScript, Chart.js, Web API calls
            from Open Weather Map API
          </small>
        </p>
      </figcaption>
    </figure>
  );
};

export default CurrentWeatherComponent;
