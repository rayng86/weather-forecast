import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import dayjs from 'dayjs';

type Weather5DayForecast3HRData = {
  list: Array<{ dt: number, dt_txt: string, main: { temp: number } }>,
}

type WeatherComponentProps = {
  weatherData: { kind: PossibleStates.success, data: Weather5DayForecast3HRData},
  setCity: Function,
  city: string,
  updateCityForecast: any,
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
        labels: weatherData.list.map(n => dayjs(n.dt_txt).format('MM/DD/YY h:mm A')),
        datasets: [
          {
            label: "Temperature (Fahrenheit)",
            data: weatherData.list.map(n => n.main.temp),
            backgroundColor: "#a0c1b9",
            fill: false,
            borderWidth: 3,
          }
        ]
      }
    });
  });
  return (
    <canvas id="5DayForecast3HRData" width="400" height="200" />
  );
};

const WeatherComponent = ({ weatherData, city, setCity, updateCityForecast } : WeatherComponentProps) => {
  return (
    <div>
      <input type='text' value={city} onChange={(x) => setCity(x.target.value)} />
      <button onClick={updateCityForecast}>Set</button>
      <WeatherChartComponent weatherData={weatherData.data} />
      <h1>{dayjs().format('MM/DD/YY h:mm A')}</h1>
      <h2>Data:</h2>
      <div style={{ margin: '0 1rem', border: '1px solid #70a0af', overflow: 'hidden', height: '200px', position: 'relative', overflowY: 'scroll' }}>
        <code style={{ fontSize: 'small', wordBreak: 'break-word' }}>{JSON.stringify(weatherData)}</code>
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
| { kind: PossibleStates.success, data: any }

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

// exhaustive switch statement helper function
// https://dev.to/ddiprose/exhaustive-switch-statement-with-typescript-26dh
export const assertUnreachable = (x: never) => null;

const get5DayForecast3HRWeatherData = (city: string, setCurrentState: Function) => {
  setCurrentState({ kind: PossibleStates.loading })
  axios.get(`${OWM_BASE_URL}/forecast?q=${city}&units=imperial&appid=${OWM_API_KEY}`)
  .then(res => {
    const data = res.data;
    setCurrentState({ kind: PossibleStates.success, data })
  }).catch(err => {
    if (err.response) {
      setCurrentState({ kind: PossibleStates.error, errorObject: err.response })
      console.log('error in response', err.response);
    } else if (err.request) {
      setCurrentState({ kind: PossibleStates.error, errorObject: err.request })
      console.log('error in request', err.request);
    } else {
      console.log('something else went horribly wrong')
    }
  })
}

const ErrorComponent = () => {
  const refreshPage = ()=>{
    window.location.reload();
  }
  return (
    <div><p>An error has occurred.</p><button onClick={refreshPage}>Refresh Page</button></div>
  );
};

const DisplayWeatherWrapper = () => {
  const [city, setCity] = useState('New York');
  const [currentState, setCurrentState] = useState<State>({ kind: PossibleStates.initial });
  useEffect(() => {
    get5DayForecast3HRWeatherData(city, setCurrentState);
  }, []);
  const updateCityForecast = () => {
    get5DayForecast3HRWeatherData(city, setCurrentState);
  };
  switch (currentState.kind) {
    case PossibleStates.success:
      return (<WeatherComponent updateCityForecast={updateCityForecast} setCity={setCity} city={city} weatherData={currentState} />);
    case PossibleStates.initial:
    case PossibleStates.loading:
      return <div>Loading...</div>;
    case PossibleStates.error:
      return <ErrorComponent />;
    default:
      return assertUnreachable(currentState);
  }
}

export default DisplayWeatherWrapper;