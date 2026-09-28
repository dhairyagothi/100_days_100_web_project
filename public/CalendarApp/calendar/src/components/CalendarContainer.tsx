import React from 'react';
import styles from './CalendarContainer.module.css';

export const CalendarContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Wall Shadows behind the paper */}
      <div className={styles.shadowDeep} />
      <div className={styles.shadowSharp} />
      
      {/* The Physical Calendar Paper Board */}
      <div className={styles.paperBoard}>
        
        {/* Hardware Spiral Binder Simulation */}
        <div className={styles.binderContainer}>
          <div className={styles.ringsGroup}>
            {[...Array(16)].map((_, i) => (
              <div key={`left-${i}`} className={styles.binderRingWrapper}>
                <div className={`${styles.wireRing} ${styles.wireRingLeft}`} />
                <div className={`${styles.wireRing} ${styles.wireRingRight}`} />
                <div className={styles.holePunch} />
              </div>
            ))}
          </div>
          
          <div className={styles.centerHangerWrapper}>
             {/* The metal hanger wire shaped via highly realistic SVG curve */}
             <svg width="60" height="40" viewBox="0 0 60 40" className="absolute top-[-30px] left-1/2 -translate-x-1/2 overflow-visible z-10" style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.4))" }}>
               <path 
                 d="M 0 36 C 20 36 25 5 30 5 C 35 5 40 36 60 36" 
                 fill="none" 
                 stroke="url(#wireGradient)" 
                 strokeWidth="4.5" 
                 strokeLinecap="round"
               />
               <defs>
                 <linearGradient id="wireGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#f5f5f5ff"/>
                   <stop offset="100%" stopColor="#737373"/>
                 </linearGradient>
               </defs>
             </svg>
             {/* The wall nail supporting it */}
             <div className={styles.centerNail} />
          </div>

          <div className={styles.ringsGroup}>
            {[...Array(16)].map((_, i) => (
              <div key={`right-${i}`} className={styles.binderRingWrapper}>
                <div className={`${styles.wireRing} ${styles.wireRingLeft}`} />
                <div className={`${styles.wireRing} ${styles.wireRingRight}`} />
                <div className={styles.holePunch} />
              </div>
            ))}
          </div>
        </div>

        {/* Content of the calendar */}
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};