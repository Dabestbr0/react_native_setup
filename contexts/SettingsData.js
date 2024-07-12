// Get SettingsData from SettingsScreen.js to here

// Once rendered, then it will be then used in the Timer Animation Page

// Import the necessary libraries and components
// SettingsData.js

import React, { createContext, useState } from 'react';

// Create context for settings
export const SettingsContext = createContext();

// Define SettingsProvider component
export const SettingsProvider = ({ children }) => {
  const [OnYourMark_interval, setOnYourMark_Interval] = useState(3);
  const [GetSet_interval, setGetSet_Interval ] = useState(1);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isRandomEnabled, setIsRandomEnabled] = useState(true);


  return (
    <SettingsContext.Provider value={{ 
        OnYourMark_interval, setOnYourMark_Interval, 
        GetSet_interval, setGetSet_Interval,
        isVibrationEnabled, setIsVibrationEnabled,
        isAudioEnabled, setIsAudioEnabled,
        isRandomEnabled, setIsRandomEnabled,
        }}>
        {children}
    </SettingsContext.Provider>
  );
};
