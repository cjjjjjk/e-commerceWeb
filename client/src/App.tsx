import React from 'react';
import './App.css';

function App() {
  const testENV = process.env.REACT_APP_API_URL;

  return (
    <div className="App">
      <header className="App-header">
        <img src="logo512.png" className="App-logo" alt="logo" />
          <button className="btn btn-primary p-4">Bootstrap Button</button>
      <div className='d-flex flex-row gap-4 bg-dark p-4'>
          <span>Primeicon search: </span>
          <i className='pi pi-search'></i>
          <span>{'test ENV: '+ testENV}</span>
      </div>
      </header>
    </div>
  );
}

export default App;
