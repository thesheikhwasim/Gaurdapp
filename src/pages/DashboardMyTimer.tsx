import React from 'react';
import { useStopwatch } from 'react-timer-hook';

export default function MyStopwatch({test}) {
    const stopwatchOffset = new Date(); 
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + test);
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true, offsetTimestamp: stopwatchOffset });


  return (
    <div className='duty-time-div'>
        <span>Duty Time: {days} Days</span>, <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
    </div>
  );
}