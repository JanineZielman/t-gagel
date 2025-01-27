import React from 'react';
import styles from './Hero.module.scss';

export default function Hero({ gallery}) {
  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.gallery}>
        <img src={gallery.left.edges[0].node.mediaItemUrl}/>
        <img src={gallery.right.edges[0].node.mediaItemUrl}/>
      </div>
      <div className={styles.logo}>
        <div className={styles.maskImg}></div>
      </div>
    </div>
  );
}
