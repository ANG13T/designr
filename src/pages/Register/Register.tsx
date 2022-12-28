import React, { useState } from 'react';
import { goBack, goTo } from 'react-chrome-extension-router';
import logo from '../../assets/designr-logo.png';
import { supabase } from '../../services/supabaseClient';
import Login from '../Login/Login';
import './Register.css';

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('border-gray-300'); 
  const [passwordErrror, setPasswordError] = useState('border-gray-300');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkError = () => {
    setErrorMessage('');
    if(!loading) {
      let isValid = true;
      if(email.length > 0 && validateEmail(email)) {
        setEmailError('border-gray-300')
      } else {
        setEmailError('border-red-400')
        isValid = false;
      }

      if(password.length < 6) {
        setPasswordError('border-red-400')
        isValid = false;
      } else {
        setPasswordError('border-gray-300')
      }

      if(isValid) {
        createUser();
      }
    }
  }

  const createUser = async() => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({ email: email, password: password })
      if (error) throw error
    } catch (error: any) {

      // alert(error.error_description || error.message)
      setErrorMessage(error.error_description || error.message)
    } finally {
      setLoading(false)
      console.log("done!!!")
    }
  }

  const googleSignUp = () => {

  }

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
                                onChange={(ev) => setEmail(ev.target.value)}
                                className={`text-sm text-black px-4 py-2 transition duration-300 border ${emailError} rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200`}
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
                                onChange={(ev) => setPassword(ev.target.value)}
                                className={`text-sm text-black px-4 py-2 transition duration-300 border ${passwordErrror} rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200`}
                            />
                        </div>

                        <p className="text-sm error-message">{errorMessage}</p>

                        <div>
                            <button
                                type='button'
                                onClick={() => checkError()}
                                className="text-sm w-full px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4 mb-1"
                            >
                                {!loading ? 'Create Account' : <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>}
                            </button>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <span className="flex items-center justify-center space-x-2">
                                <span className="h-px bg-gray-400 w-14"></span>
                                <span className="font-normal text-white text-sm">or sign up with</span>
                                <span className="h-px bg-gray-400 w-14"></span>
                            </span>
                            <div className="flex flex-col mt-1">
                            <div className='w-full mr-10'>
                                <button type="button" onClick={() => googleSignUp()} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2">
                                    <svg className="mr-2 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                    Sign up with Google
                                </button>
                            </div>
                            </div>
                        </div>
                        <p className="text-sm font-light text-white">
                                Already have an account? <button onClick={() => goTo(Login)}
                                    className="font-medium text-blue-400">Log In</button>
                            </p>
                    </form>
                </div>
            </header>
        </div>
  );
}

export default Register;
