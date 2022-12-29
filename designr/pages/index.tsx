import styles from '../styles/Home.module.css';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <img src='next-assets/designr-logo.png' className={styles.logo} alt="logo" />

        {/* <button type="button" className={styles.customButton}>
          Log into Account
        </button>

        <button type="button" className={styles.customButton}>
          Create an Account
        </button> */}
        <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
      ) : (
        <p>Account page will go here.</p>
      )}
    </div>

      </header>
    </div>
  )
}
