import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

type Weather5DayForecast3HRData = {
  list: Array<{ dt: number, dt_txt: string, main: { temp: number } }>,
}

type CurrentWeatherData = {
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
  },
  weather: Array<{ id: number, description: string }>,
}

type WeatherComponentProps = {
  weatherData: {
    kind: PossibleStates.success,
    data: Weather5DayForecast3HRData,
    data2: CurrentWeatherData,
  },
  setCity: Function,
  city: string,
  updateCityForecast: () => void,
}

type WeatherChartComponentProps = {
  weatherData: Weather5DayForecast3HRData,
}

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
            label: "Temperature (Fahrenheit)",
            data: weatherData.list.map(n => n.main.temp),
            backgroundColor: "#a0c1b9",
            fill: false,
            borderWidth: 1,
            borderColor: '#a0c1b9',
          }
        ]
      }
    });
  });
  return (
    <canvas id="5DayForecast3HRData" width="100%" height="100%" />
  );
};

type CityInputFieldProps = {
  city: string,
  setCity: Function,
  updateCityForecast: () => void,
}

const CityInputField = ({ city, setCity, updateCityForecast } : CityInputFieldProps) => (
  <div>
    <input type='text' value={city} onChange={(x) => setCity(x.target.value)} />
    <button onClick={updateCityForecast}>Set</button>
  </div>
);

const WeatherComponent = ({ weatherData, city, setCity, updateCityForecast } : WeatherComponentProps) => {
  const todayDate = dayjs().format('MM/DD/YY h:mm A');
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div className="wforecast-logo">
          <h1>Weather Forecast</h1>
          <h5>Web app built with react</h5>
        </div>
        <CityInputField city={city} setCity={setCity} updateCityForecast={updateCityForecast} />
        <CurrentWeatherComponent weatherData={weatherData}/>
      </div>
      <div style={{ width: '600px' }}>
        <WeatherChartComponent weatherData={weatherData.data} />
        <h1 style={{ fontWeight: 200, color: '#70a0af' }}>{todayDate}</h1>
      </div>
    </div>
  );
};

enum PossibleStates {
  initial = 'initial',
  loading = 'loading',
  success = 'success',
  error = 'error',
}

type State =
| { kind: PossibleStates.initial, }
| { kind: PossibleStates.loading, }
| { kind: PossibleStates.error, errorObject: any }
| { kind: PossibleStates.success, data: Weather5DayForecast3HRData, data2: CurrentWeatherData }

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

// exhaustive switch statement helper function
// https://dev.to/ddiprose/exhaustive-switch-statement-with-typescript-26dh
export const assertUnreachable = (x: never) => null;

const owmAPICallHelperFn = (city: string, setCurrentState: Function) => {
  setCurrentState({ kind: PossibleStates.loading });
  const request1 = axios.get(`${OWM_BASE_URL}/forecast?q=${city}&units=imperial&appid=${OWM_API_KEY}`);
  const request2 = axios.get(`${OWM_BASE_URL}/weather?q=${city}&units=imperial&appid=${OWM_API_KEY}`);
  const makeAPICalls = async () => {
    Promise.allSettled([request1, request2]).then((results) => {
      if ((results[0].status === 'fulfilled' && results[0].value) && (results[1].status === 'fulfilled' && results[1].value)) {
      const currentWeatherData = results[1].value.data;
        setCurrentState({ kind: PossibleStates.success, data: results[0].value.data, data2: currentWeatherData })
      } else if (results[0].status === 'rejected' && results[0].reason) {
        setCurrentState({ kind: PossibleStates.error, errorObject: results[0].reason.response.data.message });
      }
    });
  };
  makeAPICalls();
}

const ErrorComponent = () => {
  const refreshPage = ()=>{
    window.location.reload();
  }
  return (
    <div><p>An error has occurred.</p><button onClick={refreshPage}>Refresh Page</button></div>
  );
};

const LoadingComponent = () => (
  <div>
    <div className="loading-ring"></div>
  </div>
);

const DEFAULT_CONFIG = {
  city: 'New York',
  nightHour: 17,
};

type CurrentWeatherComponentProps = {
  weatherData: { kind: PossibleStates.success, data: Weather5DayForecast3HRData, data2: CurrentWeatherData },
}

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

const DisplayWeatherWrapper = () => {
  const [city, setCity] = useState(DEFAULT_CONFIG.city);
  const [currentState, setCurrentState] = useState<State>({ kind: PossibleStates.initial });
  useEffect(() => {
    owmAPICallHelperFn(DEFAULT_CONFIG.city, setCurrentState);
  }, []);
  const updateCityForecast = () => {
    owmAPICallHelperFn(city, setCurrentState);
  };
  switch (currentState.kind) {
    case PossibleStates.success:
      return (<WeatherComponent updateCityForecast={updateCityForecast} setCity={setCity} city={city} weatherData={currentState} />);
    case PossibleStates.initial:
    case PossibleStates.loading:
      return <LoadingComponent />;
    case PossibleStates.error:
      return <ErrorComponent />;
    default:
      return assertUnreachable(currentState);
  }
};

export default DisplayWeatherWrapper;