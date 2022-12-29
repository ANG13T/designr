import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import '../styles/Home.module.css'
import logo from 'designr-logo.png';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="App">
      <header className="App-header border-gradient border-gradient-purple">
        <img src='/designr-logo.png' className="App-logo mb-20" alt="logo" />

        {/* <button onClick={() => goTo(Login)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-10 mr-10 mb-10 mt-5">
          Log into Account
        </button>


      <div className='w-full ml-10 mr-10'>
        <button onClick={() => goTo(Register)} type="button" className="c-button text-white bg-transparent hover:bg-white hover:text-black border border-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
          Create an Account
        </button>
      </div> */}

      </header>
    </div>
  )
}
