import React, { useEffect, useState } from 'react';
import logo from './assets/designr-logo.png';
import './App.css';
import {
  goTo
} from 'react-chrome-extension-router';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { supabase } from './services/supabaseClient';

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  
  return (
    <div>
      {!session ? 
      <div className="App">
      <header className="App-header border-gradient border-gradient-purple">
        <img src={logo} className="App-logo mb-20" alt="logo" />

        <button onClick={() => goTo(Login)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-10 mr-10 mb-10 mt-5">
          Log into Account
        </button>


      <div className='w-full ml-10 mr-10'>
        <button onClick={() => goTo(Register)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
          Create an Account
        </button>
      </div>

      </header>
    </div>: <div className="App">
        <header className="App-header border-gradient border-gradient-purple">
          <img src={logo} className="App-logo mb-20" alt="logo" />

          <button onClick={() => goTo(Login)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-10 mr-10 mb-10 mt-5">
            Authed inside
          </button>


        <div className='w-full ml-10 mr-10'>
          <button onClick={() => goTo(Register)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
            Create an Account
          </button>
        </div>

        </header>
      </div>}
      
    </div>
  );
}

export default App;
