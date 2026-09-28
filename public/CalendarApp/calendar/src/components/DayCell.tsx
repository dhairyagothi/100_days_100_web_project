import React, { useState, useRef, useEffect } from 'react';
import { format, isToday, isSameMonth, isWeekend } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flag } from 'lucide-react';
import styles from './DayCell.module.css';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  holiday?: string;
  customLabel?: string;
  onSetLabel?: (label: string) => void;
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  holiday,
  customLabel,
  onSetLabel,
  onClick,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);
  const weekend = isWeekend(date);

  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(customLabel || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftLabel(customLabel || '');
    }
  }, [customLabel, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSetLabel) {
      onSetLabel(draftLabel);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setDraftLabel(customLabel || '');
    }
  };

  const dayOfWeek = date.getDay();
  let tooltipClass = styles.tooltipCenter;
  let arrowClass = styles.arrowCenter;

  if (dayOfWeek === 0) {
    tooltipClass = styles.tooltipRight;
    arrowClass = styles.arrowLeft;
  } else if (dayOfWeek === 6) {
    tooltipClass = styles.tooltipLeft;
    arrowClass = styles.arrowRight;
  }

  return (
    <div className={styles.cellContainer} onDoubleClick={handleDoubleClick}>
      {isInRange && !isSelectedStart && !isSelectedEnd && (
        <div className={styles.rangeBgFull} />
      )}
      {isSelectedStart && isInRange && !isSelectedEnd && (
        <div className={styles.rangeBgStart} />
      )}
      {isSelectedEnd && isInRange && !isSelectedStart && (
        <div className={styles.rangeBgEnd} />
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          styles.dayButton,
          !isCurrentMonth && styles.notCurrentMonth,
          isCurrentMonth && weekend && !isSelectedStart && !isSelectedEnd && !today && styles.weekendDay,
          isCurrentMonth && !weekend && !isSelectedStart && !isSelectedEnd && !today && styles.standardDay,
          today && !isSelectedStart && !isSelectedEnd && styles.todayDay,
          isSelectedStart && styles.selectedStart,
          isSelectedEnd && !isSelectedStart && styles.selectedEnd
        )}
      >
        {format(date, 'd')}
        
        {isSelectedStart && (
          <Star className={styles.iconStart} fill="currentColor" strokeWidth={0} />
        )}
        
        {isSelectedEnd && !isSelectedStart && (
          <Flag className={styles.iconEnd} fill="currentColor" strokeWidth={0} />
        )}

        {holiday && !isSelectedStart && !isSelectedEnd && (
          <span className={styles.holidayIndicator} />
        )}

        {holiday && (
          <div className={cn(styles.tooltip, tooltipClass)}>
            <span className={cn(styles.tooltipArrow, arrowClass)} />
            {holiday}
          </div>
        )}
      </motion.button>
      
      {!isEditing && customLabel && (
        <div className={styles.customLabelBadge} title={customLabel}>
          {customLabel}
        </div>
      )}

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className={styles.labelInputWrapper}
          >
            <input
              ref={inputRef}
              autoFocus
              className={styles.labelInput}
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="Tag..."
              maxLength={15}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};