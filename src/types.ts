import { PossibleStates } from './constants'

export type Weather5DayForecast3HRData = {
  list: Array<OWMWeatherData>,
}

export type OWMWeatherData = {
  dt: number,
  dt_txt: string,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    humidity: number,
  },
  weather: Array<{ id: number, description: string }>,
}

export type WeatherComponentProps = {
  weatherData: {
    kind: PossibleStates.success,
    data: Weather5DayForecast3HRData,
    data2: OWMWeatherData,
  },
  setCity: Function,
  city: string,
  updateCityForecast: () => void,
}

export type WeatherChartComponentProps = {
  weatherData: Weather5DayForecast3HRData,
}

export type CityInputFieldProps = {
  city: string,
  setCity: Function,
  updateCityForecast: () => void,
}

export type State =
| { kind: PossibleStates.initial, }
| { kind: PossibleStates.loading, }
| { kind: PossibleStates.error, errorStr: string }
| { kind: PossibleStates.success, data: Weather5DayForecast3HRData, data2: OWMWeatherData }

export type WeatherDataProps = {
  weatherData: { kind: PossibleStates.success, data: Weather5DayForecast3HRData, data2: OWMWeatherData },
}

export type ErrorComponentProps = {
  errorStr: string,
}