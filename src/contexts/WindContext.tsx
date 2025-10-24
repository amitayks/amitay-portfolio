import { createContext, useContext, useEffect, useState } from "react";

interface WindContextType {
  isWindActive: boolean;
  windStartTime: number;
}

const WindContext = createContext<WindContextType | undefined>(undefined);

export const WindProvider = ({ children }: { children: React.ReactNode }) => {
  const [isWindActive, setIsWindActive] = useState(false);
  const [windStartTime, setWindStartTime] = useState(0);

  useEffect(() => {
    const scheduleNextGust = () => {
      // Random interval between 10-18 seconds - like nature's unpredictable breath
      const randomDelay = Math.random() * 8000 + 10000;

      const timeout = setTimeout(() => {
        setIsWindActive(true);
        setWindStartTime(Date.now());

        // Wind gust lasts for 2 seconds - a gentle but noticeable breeze
        setTimeout(() => {
          setIsWindActive(false);
          scheduleNextGust();
        }, 2000);
      }, randomDelay);

      return timeout;
    };

    const timeout = scheduleNextGust();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <WindContext.Provider value={{ isWindActive, windStartTime }}>
      {children}
    </WindContext.Provider>
  );
};

export const useWind = () => {
  const context = useContext(WindContext);
  if (!context) {
    throw new Error("useWind must be used within WindProvider");
  }
  return context;
};
