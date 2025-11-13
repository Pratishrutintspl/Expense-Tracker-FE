import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = {
  Night: {
    background: "#0a0f24",
    card: "#111827",
    text: "#ffffff",
    hover: "#00ffff",
    gradient: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
  },
  Sakura: {
    background: "#ffe4e1",
    card: "#fff0f5",
    text: "#5c2a2a",
    hover: "#ff80ab",
    gradient: "linear-gradient(90deg, #ffb6c1, #ffc1cc, #ffdce5)",
  },
  Ember: {
    background: "#1a0f0f",
    card: "#2b1818",
    text: "#ffe4e1",
    hover: "#ff7043",
    gradient: "linear-gradient(90deg, #ff512f, #dd2476)",
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("Night");
  const [theme, setTheme] = useState(themes[themeName]);

  useEffect(() => {
    setTheme(themes[themeName]);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
