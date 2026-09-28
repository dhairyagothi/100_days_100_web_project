import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isAfter, isBefore, isSameDay, isWeekend } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { getHoliday } from '../lib/holidays';
import { DayCell } from './DayCell';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MonthGrid.module.css';

interface MonthGridProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onDateClick: (date: Date) => void;
  direction: number;
  customLabels: Record<string, string>;
  onSetLabel: (dateStr: string, label: string) => void;
}

const variants = {
  enter: (direction: number) => ({
    rotateX: direction > 0 ? -90 : 90,
    opacity: 0,
    translateY: direction > 0 ? -20 : 20,
    transformOrigin: 'top',
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    translateY: 0,
    transformOrigin: 'top',
  },
  exit: (direction: number) => ({
    rotateX: direction < 0 ? -90 : 90,
    opacity: 0,
    translateY: direction < 0 ? -20 : 20,
    transformOrigin: 'top',
  }),
};

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectionStart,
  selectionEnd,
  onDateClick,
  direction,
  customLabels,
  onSetLabel
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "EEEEEE";
  const days = [];
  let day = startDate;

  // For header days (Mo, Tu, We, etc.)
  for (let i = 0; i < 7; i++) {
    const isWeekendDay = isWeekend(day);
    days.push(
      <div key={`header-${i}`} className={cn(styles.dayHeaderCell, isWeekendDay && styles.weekendHeader)}>
        {format(day, dateFormat)}
      </div>
    );
    day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
  }

  // To generate date cells
  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className={styles.container} style={{ perspective: '1000px' }}>
      <div className={styles.headerRow}>
        <h3 className={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className={styles.navButtons}>
          <button onClick={onPrevMonth} className={styles.navButton}>
            <ChevronLeft className={styles.navIcon} />
          </button>
          <button onClick={onNextMonth} className={styles.navButton}>
            <ChevronRight className={styles.navIcon} />
          </button>
        </div>
      </div>

      <div className={styles.daysHeaderGrid}>
        {days}
      </div>

      <div className={styles.gridContainer}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={styles.gridMotionWrapper}
          >
            {dateInterval.map((date, i) => {
              const isSelectedStart = selectionStart ? isSameDay(date, selectionStart) : false;
              const isSelectedEnd = selectionEnd ? isSameDay(date, selectionEnd) : false;
              const isInRange = selectionStart && selectionEnd 
                ? (isSameDay(date, selectionStart) || isSameDay(date, selectionEnd) || (isAfter(date, selectionStart) && isBefore(date, selectionEnd)))
                : false;

              return (
                <DayCell
                  key={date.toString() + i}
                  date={date}
                  currentMonth={currentMonth}
                  isSelectedStart={isSelectedStart}
                  isSelectedEnd={isSelectedEnd}
                  isInRange={isInRange}
                  holiday={getHoliday(date)}
                  customLabel={customLabels[format(date, 'yyyy-MM-dd')]}
                  onSetLabel={(label) => onSetLabel(format(date, 'yyyy-MM-dd'), label)}
                  onClick={() => onDateClick(date)}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};