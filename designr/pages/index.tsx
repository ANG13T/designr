import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import logo from '/designr-logo.png';

export default function Home() {
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <img src='next-assets/designr-logo.png' className={styles.logo} alt="logo" />

        <button type="button" className={styles.customButton}>
          Log into Account
        </button>


      <div className={styles.container}>
        <button type="button" className={styles.customButton}>
          Create an Account
        </button>
      </div>

      </header>
    </div>
  )
}
