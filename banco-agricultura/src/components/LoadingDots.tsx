import React, { useEffect, useState } from "react";
import "./style/LoadingDots.css";

const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return "";
        }
        return prevDots + "●";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-dots">
      <span className={`dot ${dots.length >= 1 ? "active" : ""}`}></span>
      <span className={`dot ${dots.length >= 2 ? "active" : ""}`}></span>
      <span className={`dot ${dots.length >= 3 ? "active" : ""}`}></span>
    </div>
  );
};

export default LoadingDots;
