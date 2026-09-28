import React from 'react';
import { WallCalendar } from './components/WallCalendar';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          SMART <span className={styles.titleLight}>CALENDAR</span>
        </h1>
      </header>
      
      <main>
        <WallCalendar />
      </main>
      
      <footer className={styles.footer}>
        <p>Where smart planning begins</p>
      </footer>
    </div>
  );
}

export default App;