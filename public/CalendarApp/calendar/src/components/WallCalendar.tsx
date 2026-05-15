import React, { useState, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { CalendarContainer } from './CalendarContainer';
import { HeroSection } from './HeroSection';
import { MonthGrid } from './MonthGrid';
import { NotesSidebar } from './NotesSidebar';
import styles from './WallCalendar.module.css';

const MONTH_IMAGES = [
  "https://i.pinimg.com/1200x/a7/f7/d4/a7f7d4dd02de25d09b2d8a6191bc1e3e.jpg", // Jan
  "https://i.pinimg.com/736x/a2/28/26/a228268a13090495d435fd0644248d48.jpg", // Feb
  "https://i.pinimg.com/736x/0c/c6/97/0cc697e4b25cc9c651d9b7104cbd8f5f.jpg", // Mar
  "https://i.pinimg.com/1200x/81/3d/5c/813d5c6a12e23f5a4c099e3e2f06950c.jpg", // Apr
  "https://i.pinimg.com/736x/1b/b9/71/1bb9717b9c33e231a1c7b7c412e42d5c.jpg", // May
  "https://i.pinimg.com/736x/37/3a/a8/373aa87ffabf07fef5dc28ba4c41677a.jpg", // Jun
  "https://i.pinimg.com/1200x/37/aa/95/37aa952cf49e888363b9c6e16558b6bd.jpg", // Jul
  "https://i.pinimg.com/736x/c1/c9/e3/c1c9e3ad718cfe68e47d459e7753af21.jpg", // Aug
  "https://i.pinimg.com/736x/64/07/b8/6407b82a7fe01ef9b458cb76e1f19c4b.jpg", // Sep
  "https://i.pinimg.com/1200x/d7/d9/20/d7d9203a9106a781075b898f665dbcb4.jpg", // Oct
  "https://i.pinimg.com/1200x/6e/96/74/6e9674ff16d906de4554f11fa69b2c11.jpg", // Nov
  "https://i.pinimg.com/736x/50/71/15/507115cf827a9a26bff39cc914b10244.jpg"  // Dec
];

export const WallCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  // Range selection logic
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(date);
      setSelectionEnd(null);
    } else {
      if (date < selectionStart) {
        setSelectionStart(date);
        setSelectionEnd(selectionStart);
      } else {
        setSelectionEnd(date);
      }
    }
  };

  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('calendar-custom-labels');
    if (saved) {
      try {
        setCustomLabels(JSON.parse(saved));
      } catch (e) {
        setCustomLabels({});
      }
    }
  }, []);

  const handleSetLabel = (dateStr: string, label: string) => {
    setCustomLabels(prev => {
      const next = { ...prev };
      if (!label.trim()) {
        delete next[dateStr];
      } else {
        next[dateStr] = label.trim();
      }
      localStorage.setItem('calendar-custom-labels', JSON.stringify(next));
      return next;
    });
  };

  return (
    <CalendarContainer>
      <HeroSection 
        currentMonth={currentMonth} 
        imageSrc={MONTH_IMAGES[currentMonth.getMonth()]} 
      />
      
      <div className={styles.calendarLayout}>
        <div className={styles.gridColumn}>
          <MonthGrid
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            onDateClick={handleDateClick}
            direction={direction}
            customLabels={customLabels}
            onSetLabel={handleSetLabel}
          />
        </div>
        <div className={styles.gridColumn}>
          <NotesSidebar 
            currentMonth={currentMonth}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            onSetSelection={(s, e) => {
              setSelectionStart(s);
              setSelectionEnd(e);
            }}
          />
        </div>
      </div>
    </CalendarContainer>
  );
};