import React from 'react';
import logo from '../../assets/designr-logo.png';
import './Login.css';

function Login() {
  return (
    <div className="App">
      <header className="App-header border-gradient border-gradient-purple">
      <img src={logo} className="App-logo mb-20" alt="logo" />
      <h3>Login</h3>
      </header>
    </div>
  );
}

export default Login;
