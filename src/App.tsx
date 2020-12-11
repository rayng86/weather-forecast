import React from 'react';
import './App.css';
import DisplayWeatherWrapper from './components/WeatherComponent'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DisplayWeatherWrapper />
      </header>
    </div>
  );
}

export default App;
