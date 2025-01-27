import React, { useState, useEffect } from 'react';
import styles from './Hero.module.scss';

export default function Hero({ gallery }) {
  const [currentImages, setCurrentImages] = useState({
    left: gallery.left.edges[0].node.mediaItemUrl,
    right: gallery.right.edges[0].node.mediaItemUrl,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomize a new combination of images
      const randomLeftIndex = Math.floor(Math.random() * gallery.left.edges.length);
      const randomRightIndex = Math.floor(Math.random() * gallery.right.edges.length);

      setCurrentImages({
        left: gallery.left.edges[randomLeftIndex].node.mediaItemUrl,
        right: gallery.right.edges[randomRightIndex].node.mediaItemUrl,
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [gallery]);

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
