import React, { useState } from 'react';
import UseUserContext from '../hooks/UseUserContext';
const ThemeChanger = () => {
  
  const themes = [
    "light",
    "synthwave",
    "dark",
    "cupcake",
    "aqua",
    "luxury",
    "black",
    "acid",
    "retro",
    "valentine",
    "coffee",
    "abyss",
    "bumblebee"
  ];
  
  // State to track the selected theme
  const {theme,setTheme} = UseUserContext();
  
  // Handler for theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };
  
  return (
    <div className="theme-changer flex justify-around">
      <div>
      <label htmlFor="theme-select">Choose Theme: </label>
      <select 
      className='select'
        id="theme-select"
        value={theme}
        onChange={handleThemeChange}
      >
        {themes.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      </div>
      <div className="theme-preview">
        <p>Current theme: <strong>{theme}</strong></p>
      </div>
    </div>
  );
};

export default ThemeChanger;