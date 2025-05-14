import React, { useEffect, useState } from "react";
import "./style/LoadingDots.css";

const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length >= 3) {
            return "";
          }
          return prevDots + "●";
        });
      }, 500);

      timeout = setTimeout(() => {
        setIsLoading(false);
        clearInterval(interval);
      }, 6000); // Detener después de 6 segundos
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <div className="loading-dots">
      <span className={`dot ${dots.length >= 1 ? "active" : ""}`}></span>
      <span className={`dot ${dots.length >= 2 ? "active" : ""}`}></span>
      <span className={`dot ${dots.length >= 3 ? "active" : ""}`}></span>
    </div>
  );
};

export default LoadingDots;
