import React, { useState } from 'react';
import { goBack, goTo } from 'react-chrome-extension-router';
import logo from '../../assets/designr-logo.png';
import { supabase } from '../../services/supabaseClient';
import './Settings.css';

function Settings() {

  return (
    <div className="Dashboard">
      <header className="Dashboard-header border-gradient border-gradient-purple">
        <div className="border-b-2 mb-2 border-white w-full flex">
          <div className="p-4 justify-start">
            <button type="button" className="text-white border border-white hover:bg-white hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-4" onClick={() => goBack()}>
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
            </button>
          </div>
          <div>
            <img src={logo} className="Dashboard-logo h-11 ml-7 mt-4" alt="logo" />
          </div>
        </div>


        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            {/* Log Out */}
            {/* Delete Account */}
        </div>

      </header>
    </div>
  );
}

export default Settings;
