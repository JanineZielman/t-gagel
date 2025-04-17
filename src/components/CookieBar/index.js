import React, { useState } from "react";
import styles from "./CookieBar.module.scss";

const CookieBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    console.log("Cookies accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    console.log("Cookies declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookieBar}>
      <p>De website van 'T Gagel gebruik cookies</p>
      <div className={styles.buttons}>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default CookieBar;
