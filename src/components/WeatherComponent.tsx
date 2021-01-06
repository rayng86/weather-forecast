import React, { useState, useEffect } from 'react';
import { DEFAULT_CONFIG, PossibleStates } from '../constants';
import { CityInputFieldProps, CurrentLocationComponentProps, MeasurementTypes, State, WeatherComponentProps } from '../types';
import WeatherChartComponent from './5Day3HRForecastChartComponent';
import CurrentWeatherComponent from './CurrentWeatherComponent';
import { ErrorComponent, LoadingComponent } from './GenericMicroComponents';
import { assertUnreachable, owmAPICallHelperFn } from '../utils';
import { ForecastCards } from './5DayForecastCards';

const CityInputField = ({ city, setCity, updateCityForecast, setMeasurementType } : CityInputFieldProps) => (
  <div style={{ display: 'flex', clear: 'both', justifyContent: 'space-between', padding: '0 23px' }}>
    <input id="searchbox" type='text' value={city} onClick={() => setCity('')} onChange={(x) => setCity(x.target.value)} />
    <button title="Set" onClick={updateCityForecast}>Set</button>
    <button title="Switch to Fahrenheit" onClick={() => setMeasurementType('F')}>F</button>
    <button title="Switch to Celsius" onClick={() => setMeasurementType('C')}>C</button>
  </div>
);

const CurrentLocationComponent = ({ showGeoLoadingSpinner, useGeolocation, geoErrorMsg } : CurrentLocationComponentProps) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ fontSize: '12px', color: 'white', padding: '8px 0px 8px 16px', textAlign: 'left' }}>
      <button className="text-button" onClick={useGeolocation}>Or Use Current Location</button>
      </div>
      {showGeoLoadingSpinner && <div className="loading-ring mini"></div>}
    </div>
    {geoErrorMsg && (
      <small style={{ color: 'red', fontSize: '10px', display: 'block', textAlign: 'left', padding: '0px 23px', maxWidth: '200px', marginBottom: '10px' }}>
        {geoErrorMsg}
      </small>
    )}
  </>
)
const WeatherComponent = ({ weatherData, city, setCity, updateCityForecast, measurementType, setMeasurementType, useGeolocation, showGeoLoadingSpinner, geoErrorMsg } : WeatherComponentProps) => (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <div className="wforecast-logo">
            <h1>Weather Forecast</h1>
            <h5>Web app built with react</h5>
          </div>
          <CityInputField
            city={city}
            setCity={setCity}
            updateCityForecast={updateCityForecast}
            measurementType={measurementType}
            setMeasurementType={setMeasurementType}
            />
          <CurrentLocationComponent showGeoLoadingSpinner={showGeoLoadingSpinner} useGeolocation={useGeolocation} geoErrorMsg={geoErrorMsg} />
          <CurrentWeatherComponent weatherData={weatherData} measurementType={measurementType} />
        </div>
        <div style={{ width: '800px' }}>
          <WeatherChartComponent measurementType={measurementType} weatherData={weatherData.data} />
          <ForecastCards weatherData={weatherData} measurementType={measurementType} />
        </div>
      </div>
    </>
);

const DisplayWeatherWrapper = () => {
  const [city, setCity] = useState(DEFAULT_CONFIG.city);
  const [currentState, setCurrentState] = useState<State>({ kind: PossibleStates.initial });
  const [measurementType, setMeasurementType] = useState<MeasurementTypes>(DEFAULT_CONFIG.measurementType);
  const [showGeoLoadingSpinner, setGeoLoadingSpinnerStatus] = useState(false);
  const [geoErrorMsg, setGeoErrorMsg] = useState('');
  useEffect(() => {
    owmAPICallHelperFn(DEFAULT_CONFIG.city, setCurrentState);
  }, []);
  const updateCityForecast = () => {
    owmAPICallHelperFn(city, setCurrentState, DEFAULT_CONFIG.geoLocation);
  };
  const useGeolocation = () => {
    if ('geolocation' in navigator) {
      setGeoLoadingSpinnerStatus(true);
      navigator.geolocation.getCurrentPosition(position => {
        setCity('Current Location');
        setGeoLoadingSpinnerStatus(false);
        setGeoErrorMsg('');
        owmAPICallHelperFn(DEFAULT_CONFIG.city, setCurrentState, [position.coords.latitude, position.coords.longitude]);
      },
      err => {
        console.warn(`Error: ${err.message}`);
        setGeoErrorMsg(`Error Reason: ${err.message}. Please enable browser location access and try again.`);
        setGeoLoadingSpinnerStatus(false);
      });
    }
  }
  switch (currentState.kind) {
    case PossibleStates.success:
      return (
        <WeatherComponent
          measurementType={measurementType}
          setMeasurementType={setMeasurementType}
          updateCityForecast={updateCityForecast}
          setCity={setCity}
          city={city}
          weatherData={currentState}
          useGeolocation={useGeolocation}
          showGeoLoadingSpinner={showGeoLoadingSpinner}
          geoErrorMsg={geoErrorMsg}
        />
      );
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