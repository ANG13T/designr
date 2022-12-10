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


        <div className="overflow-x-auto relative shadow-md sm:rounded-lg p-5 mt-10">
            {/* Log Out */}
            <p className='text-white mb-2 font-medium'>Log Out of Account</p>
            <button type="button" className="custom-button text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mb-10">Log Out</button>

            {/* Delete Account */}
            <p className='text-white mb-2 mt-10 font-medium'>Delete Account </p>
            <button type="button" className="custom-button focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Account</button>
        </div>

      </header>
    </div>
  );
}

export default Settings;
