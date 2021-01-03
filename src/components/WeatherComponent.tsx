import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DEFAULT_CONFIG, PossibleStates } from '../constants';
import { CityInputFieldProps, MeasurementTypes, State, WeatherComponentProps } from '../types';
import WeatherChartComponent from './5Day3HRForecastChartComponent';
import CurrentWeatherComponent from './CurrentWeatherComponent';
import { ErrorComponent, LoadingComponent } from './GenericMicroComponents';
import { assertUnreachable, owmAPICallHelperFn } from '../utils';
import { ForecastCards } from './5DayForecastCards';

const CityInputField = ({ city, setCity, updateCityForecast, setMeasurementType } : CityInputFieldProps) => (
  <div>
    <input type='text' value={city} onChange={(x) => setCity(x.target.value)} />
    <button onClick={updateCityForecast}>Set</button>
    <button onClick={() => setMeasurementType('F')}>F</button><button onClick={() => setMeasurementType('C')}>C</button>
  </div>
);

const WeatherComponent = ({ weatherData, city, setCity, updateCityForecast, measurementType, setMeasurementType } : WeatherComponentProps) => {
  const todayDate = dayjs().format('MM/DD/YY h:mm A');
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <div className="wforecast-logo">
            <h1>Weather Forecast</h1>
            <h5>Web app built with react</h5>
          </div>
          <CityInputField city={city} setCity={setCity} updateCityForecast={updateCityForecast} measurementType={measurementType} setMeasurementType={setMeasurementType} />
          <CurrentWeatherComponent weatherData={weatherData} measurementType={measurementType} />
        </div>
        <div style={{ width: '800px' }}>
          <WeatherChartComponent weatherData={weatherData.data} />
          <ForecastCards weatherData={weatherData} measurementType={measurementType} />
          <h1 style={{ fontWeight: 200, color: '#70a0af' }}>{todayDate}</h1>
        </div>
      </div>
    </>
  );
};

const DisplayWeatherWrapper = () => {
  const [city, setCity] = useState(DEFAULT_CONFIG.city);
  const [currentState, setCurrentState] = useState<State>({ kind: PossibleStates.initial });
  const [measurementType, setMeasurementType] = useState<MeasurementTypes>(DEFAULT_CONFIG.measurementType);
  useEffect(() => {
    owmAPICallHelperFn(DEFAULT_CONFIG.city, setCurrentState);
  }, []);
  const updateCityForecast = () => {
    owmAPICallHelperFn(city, setCurrentState);
  };
  switch (currentState.kind) {
    case PossibleStates.success:
      return (<WeatherComponent measurementType={measurementType} setMeasurementType={setMeasurementType} updateCityForecast={updateCityForecast} setCity={setCity} city={city} weatherData={currentState} />);
    case PossibleStates.initial:
    case PossibleStates.loading:
      return <LoadingComponent />;
    case PossibleStates.error:
      return <ErrorComponent errorStr={currentState.errorStr} />;
    default:
      return assertUnreachable(currentState);
  }
};

export default DisplayWeatherWrapper;