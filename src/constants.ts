import { DefaultConfigProps } from './types';

export const DEFAULT_CONFIG: DefaultConfigProps = {
  city: 'New York',
  nightHour: 17,
  measurementType: 'F',
  geoLocation: [undefined, undefined],
};

export enum PossibleStates {
  initial = 'initial',
  loading = 'loading',
  success = 'success',
  error = 'error',
}

export const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
export const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

export const degreeTextSymbol = '\u00b0';