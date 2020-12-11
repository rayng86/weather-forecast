import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js';

type Weather5DayForecast3HRData = {
  list: Array<{ dt_txt: string, main: { temp: number } }>,
}

type WeatherComponentProps = {
  weatherData: Weather5DayForecast3HRData,
}

const WeatherComponent = ({ weatherData } : WeatherComponentProps) => {
  useEffect(() => {
    const ctx = document.getElementById("5DayForecast3HRData");
    // @ts-ignore
    new Chart(ctx, {
      type: "line",
      data: {
        labels: weatherData.list.map(n => n.dt_txt),
        datasets: [
          {
            label: "Temperature in Fahrenheit",
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
    <div>
      <canvas id="5DayForecast3HRData" width="400" height="200" />
      <h2>Data:</h2>
      <div>
        <code style={{ fontSize: 'small', wordBreak: 'break-word' }}>{JSON.stringify(weatherData)}</code>
      </div>
    </div>
  );
};

enum LoadingStatuses {
  initial = 'initial',
  loading = 'loading',
  success = 'success',
  error = 'error',
}

type LoadingStates =
  | LoadingStatuses.initial
  | LoadingStatuses.loading
  | LoadingStatuses.success
  | LoadingStatuses.error

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

// exhaustive switch statement helper function
// https://dev.to/ddiprose/exhaustive-switch-statement-with-typescript-26dh
export const assertUnreachable = (x: never) => null;

const DisplayWeatherWrapper = () => {
  const [pageStatus, setStatus] = useState<LoadingStates>(LoadingStatuses.initial);
  //@ts-ignore
  const [weatherData, fetchWeatherData] = useState<WeatherComponentProps>({});
  useEffect(() => {
    setStatus(LoadingStatuses.loading);
    axios.get(`${OWM_BASE_URL}/forecast?q=New%20York&units=imperial&appid=${OWM_API_KEY}`)
      .then(res => {
        const data = res.data;
        fetchWeatherData(data)
        setStatus(LoadingStatuses.success);
      }).catch(err => {
        if (err.response) {
          setStatus(LoadingStatuses.error);
          console.log('error in response', err.response);
        } else if (err.request) {
          setStatus(LoadingStatuses.error);
          console.log('error in request', err.request);
        } else {
          setStatus(LoadingStatuses.error);
          console.log('something else went horribly wrong')
        }
      })
  }, []);
  switch (pageStatus) {
    case LoadingStatuses.success:
      //@ts-ignore
      return (<WeatherComponent weatherData={weatherData} />);
    case LoadingStatuses.initial:
    case LoadingStatuses.loading:
      return <div>Loading...</div>;
    case LoadingStatuses.error:
      return <div>An error has occurred.</div>;
    default:
      return assertUnreachable(pageStatus);
  }
}

export default DisplayWeatherWrapper;