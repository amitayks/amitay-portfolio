export function setTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("darkMode", isDark ? "true" : "false");
}

export function toggleTheme() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  setTheme(!isDarkMode);
}

function initializeTheme() {
  const savedPreference = localStorage.getItem("darkMode");

  if (savedPreference !== null) {
    setTheme(savedPreference === "true");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark);
  }
}

document.addEventListener("DOMContentLoaded", initializeTheme);
