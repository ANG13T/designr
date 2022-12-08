import React, { useState } from 'react';
import { goBack, goTo } from 'react-chrome-extension-router';
import logo from '../../assets/designr-logo.png';
import { supabase } from '../../services/supabaseClient';
import Register from '../Register/Register';
import './Dashboard.css';

function Dashboard() {

    return (
        <div className="App">
            <header className="App-header border-gradient border-gradient-purple">
                <img src={logo} className="App-logo mt-10 mb-5" alt="logo" />
                <div className="w-full p-5">
                  
                </div>
            </header>
        </div>
    );
}

export default Dashboard;
