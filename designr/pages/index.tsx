import styles from '../styles/Home.module.css'

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
