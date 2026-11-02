'use client';

import { useEffect } from 'react';

export default function HomeClientInteractions() {
  useEffect(() => {
    let hours = 1;
    let minutes = 48;
    let seconds = 22;
    const timerEl = document.getElementById('countdown-timer');

    const interval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else {
        seconds = 59;
        if (minutes > 0) {
          minutes--;
        } else {
          minutes = 59;
          if (hours > 0) hours--;
        }
      }
      if (timerEl) {
        timerEl.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
