import { useEffect, useState } from "react";

export default function useTheme() {
  // device qarab boshlang‘ich state
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState(prefersDark ? "dark" : "light");

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  // theme o‘zgarganda HTML class o‘zgaradi
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return { theme, toggleTheme };
}
