import React from 'react';
import logo from './assets/designr-logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header border-gradient border-gradient-purple">
        <img src={logo} className="App-logo mb-20" alt="logo" />

        <button type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-10 mr-10 mb-10 mt-5">
          Log into Account
        </button>


      <div className='w-full ml-10 mr-10'>
        <button type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
          Create an Account
        </button>
      </div>

      </header>
    </div>
  );
}

export default App;
