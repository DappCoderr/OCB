import React, { useState, useEffect } from "react";

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = targetDate - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="text-6xl">
      {timeLeft.days} : {timeLeft.hours} : {timeLeft.minutes} :{" "}
      {timeLeft.seconds}
    </div>
  );
};

const LaunchCountdown = () => {
  // Set the target launch date to May 30th, 2024
  const targetDate = new Date(2024, 4, 30).getTime();

  return (
    <div>
      <h1>Project Launch Countdown</h1>
      <Countdown targetDate={targetDate} />
    </div>
  );
};

export default Countdown;
