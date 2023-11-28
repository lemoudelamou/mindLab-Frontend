import React, { useEffect, useState } from 'react';
import '../style/SplashScreen.css';

import splashVideo from '../assets/tunnel.mp4';

export default function SplashScreen() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Replace "next-page" with the path to the next page
      window.location.href = '/Home';
    }, 15000);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 5000); // Show text 5 seconds before the timer ends

    // Clear the timers when the component unmounts
    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="SplashScreen">
      <video
        src={splashVideo}
        autoPlay
        loop
        muted
        className="SplashScreen-video"
      />
      {showText && (
        <div className="SplashScreen-text">
          <h1>Reaktionszeit Bewertung</h1>
        </div>
      )}
      <div className="Skip-button" onClick={() => window.location.href = '/Home'}>
        Skip
      </div>
    </div>
  );
}
