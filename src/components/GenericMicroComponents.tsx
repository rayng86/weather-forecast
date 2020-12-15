import React from 'react';
import { ErrorComponentProps } from '../types';

export const ErrorComponent = ({ errorStr } : ErrorComponentProps) => {
  const refreshPage = ()=>{
    window.location.reload();
  }
  return (
    <div><p>{errorStr} </p><button onClick={refreshPage}>Refresh Page</button></div>
  );
};

export const LoadingComponent = () => (
  <div>
    <div className="loading-ring"></div>
  </div>
);