import React, { useEffect, useState } from 'react';

type CountdownProps = {
  targetDate?: Date;
};

function getNextThursdayMidnight(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 4 = Thursday
  
    const daysUntilNextThursday = (11 - dayOfWeek) % 7 || 7; // if today is Thursday, go to next week's Thursday
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + daysUntilNextThursday);
    nextThursday.setHours(0, 0, 0, 0); // midnight
  
    return nextThursday;
  }

export const CountdownTimer: React.FC<CountdownProps> = ({ targetDate = getNextThursdayMidnight() }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <span>Time's up!</span>;
  }

  return (
    <div>
      {timeLeft.days} ימים {timeLeft.hours} שעות {timeLeft.minutes} דקות {timeLeft.seconds} שניות
    </div>
  );
};

function getTimeRemaining(target: Date) {
  const total = Math.max(0, target.getTime() - new Date().getTime());

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}
