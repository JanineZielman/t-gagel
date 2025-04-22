import React from "react";
import styles from "./CallToActionButton.module.scss";
import Link from "next/link";

const CallToActionButton = ({ children, link, onClick, isActive = false }) => {
  const buttonClass = `${styles.callToActionButton} ${isActive ? 'active' : ''}`;

  if (link) {
    return (
      <div id="button" className={buttonClass} onClick={onClick}>
        <Link prefetch={true} href={link.replace('https://gagel.janinezielman.com/', '')} passHref>
          <div className={styles.text}>{children}</div>
        </Link>
      </div>
    );
  }

  return (
    <button id="button" className={buttonClass} onClick={onClick}>
      <div className={styles.text}>{children}</div>
    </button>
  );
};

export default CallToActionButton;
