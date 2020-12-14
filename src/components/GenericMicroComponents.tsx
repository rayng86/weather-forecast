import React from 'react';

export const ErrorComponent = () => {
  const refreshPage = ()=>{
    window.location.reload();
  }
  return (
    <div><p>An error has occurred.</p><button onClick={refreshPage}>Refresh Page</button></div>
  );
};

export const LoadingComponent = () => (
  <div>
    <div className="loading-ring"></div>
  </div>
);