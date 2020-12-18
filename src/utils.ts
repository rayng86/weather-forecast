import axios from 'axios';
import dayjs from 'dayjs';
import { PossibleStates, OWM_BASE_URL, OWM_API_KEY, DEFAULT_CONFIG } from './constants';

// exhaustive switch statement helper function
// https://dev.to/ddiprose/exhaustive-switch-statement-with-typescript-26dh
export const assertUnreachable = (x: never) => null;

export const owmAPICallHelperFn = (city: string, setCurrentState: Function) => {
  setCurrentState({ kind: PossibleStates.loading });
  const request1 = axios.get(`${OWM_BASE_URL}/forecast?q=${city}&units=imperial&appid=${OWM_API_KEY}`);
  const request2 = axios.get(`${OWM_BASE_URL}/weather?q=${city}&units=imperial&appid=${OWM_API_KEY}`);
  const makeAPICalls = async () => {
    Promise.allSettled([request1, request2]).then((results) => {
      if ((results[0].status === 'fulfilled' && results[0].value) && (results[1].status === 'fulfilled' && results[1].value)) {
      const currentWeatherData = results[1].value.data;
        setCurrentState({ kind: PossibleStates.success, data: results[0].value.data, data2: currentWeatherData })
      } else if (results[0].status === 'rejected' && results[0].reason.response) {
        setCurrentState({ kind: PossibleStates.error, errorStr: results[0].reason.response.data.message });
      } else {
        setCurrentState({ kind: PossibleStates.error, errorStr: 'Something went wrong. Please try again later.' });
      }
    });
  };
  makeAPICalls();
};

export const useNightTimeCloudIcon = dayjs().hour() <= DEFAULT_CONFIG.nightHour ? '' : '-n';