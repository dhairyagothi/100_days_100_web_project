import React from 'react';
import { CanvasImageEffect } from './CanvasImageEffect';
import { format } from 'date-fns';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC<{
  currentMonth: Date;
  imageSrc: string;
}> = ({ currentMonth, imageSrc }) => {
  return (
    <div className={styles.container}>
      <CanvasImageEffect 
        imageSrc={imageSrc} 
        className={styles.canvasEffect} 
      />
      <div className={styles.gradientOverlay} />
      
      <div className={styles.textContainer}>
        <h2 className={styles.monthText}>
          {format(currentMonth, 'MMMM')}
        </h2>
        <p className={styles.yearText}>
          {format(currentMonth, 'yyyy')}
        </p>
      </div>
    </div>
  );
};