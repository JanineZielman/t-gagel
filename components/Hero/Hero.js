import React, { useState, useEffect } from 'react';
import styles from './Hero.module.scss';

export default function Hero({ gallery = {} }) {
  // Provide fallback for gallery.left.edges and gallery.right.edges
  const leftImages = gallery?.left?.edges || [];
  const rightImages = gallery?.right?.edges || [];

  // Set initial state only if there are images
  const [currentImages, setCurrentImages] = useState({
    left: leftImages[0]?.node?.mediaItemUrl || '',
    right: rightImages[0]?.node?.mediaItemUrl || '',
  });

  useEffect(() => {
    if (leftImages.length === 0 || rightImages.length === 0) {
      console.warn('Gallery does not have the required structure or is empty.');
      return;
    }

    const interval = setInterval(() => {
      // Randomize a new combination of images
      const randomLeftIndex = Math.floor(Math.random() * leftImages.length);
      const randomRightIndex = Math.floor(Math.random() * rightImages.length);

      setCurrentImages({
        left: leftImages[randomLeftIndex]?.node?.mediaItemUrl || '',
        right: rightImages[randomRightIndex]?.node?.mediaItemUrl || '',
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [leftImages, rightImages]);

  // Early return if no images are available
  if (leftImages.length === 0 || rightImages.length === 0) {
    return (
      <div className={styles.galleryWrapper}>
        <p>No images available to display.</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.gallery}>
        <img src={currentImages.left} alt="Randomized left" />
        <img src={currentImages.right} alt="Randomized right" />
      </div>
      <div className={styles.logo}>
        <div className={styles.maskImg}></div>
      </div>
    </div>
  );
}
