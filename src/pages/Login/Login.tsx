import React from 'react';
import logo from '../../assets/designr-logo.png';
import './Login.css';

function Login() {
    return (
        <div className="App">
            <header className="App-header border-gradient border-gradient-purple">
                <img src={logo} className="App-logo mt-10 mb-5" alt="logo" />
                <div className="w-full p-5">
                    <form action="#" className="flex flex-col space-y-5">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-semibold text-left text-white">Email address</label>
                            <input
                                type="email"
                                placeholder='Enter email address'
                                id="email"
                                className="text-sm text-black px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-white">Password</label>
                            </div>
                            <input
                                type="password"
                                id="password"
                                placeholder='Enter password'
                                className="text-sm text-black px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="text-sm w-full px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4 mb-1"
                            >
                                Log in
                            </button>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <span className="flex items-center justify-center space-x-2">
                                <span className="h-px bg-gray-400 w-14"></span>
                                <span className="font-normal text-white text-sm">or login with</span>
                                <span className="h-px bg-gray-400 w-14"></span>
                            </span>
                            <div className="flex flex-col mt-1">
                            <div className='w-full mr-10'>
                                <button type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2">
                                    <svg className="mr-2 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                    Sign in with Google
                                </button>
                            </div>
                            </div>
                        </div>
                        <p className="text-sm font-light text-white">
                                Don't have an account? <a href="/signup"
                                    className="font-medium text-blue-400">Create an
                                    Account</a>
                            </p>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default Login;
