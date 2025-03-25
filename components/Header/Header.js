import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import { flatListToHierarchical } from '@faustwp/core';


export default function Header({
  title = 'Headless by WP Engine',
  description,
  menuItems
}) {
  const [isNavShown, setIsNavShown] = useState(false);
  const hierarchicalMenuItems = flatListToHierarchical(menuItems);



  return (
    <header className={`${styles.header} ${isNavShown ? styles.show : ''}`}>
      <div className={styles.arrow} onClick={() => setIsNavShown(!isNavShown)}></div>
      <div className={styles.menuItems}>
        {hierarchicalMenuItems.map((item, i) => {
          return(
            <div className={styles.menuItem}>
              <Link href={item.path} key={i}> 
                <div className={styles.imgMask} style={{maskImage:`url(/api/imageProxy?url=${encodeURIComponent(item.connectedNode?.node.featuredImage?.node.mediaItemUrl)})`}}></div>
                <div className={styles.label}>{item.label}</div>
              </Link>
              <div className={styles.children}>
                {item.children.map((child, i) => {
                  return(
                    <div className={styles.child}>
                      <Link href={child.path} key={i}> 
                        <div className={styles.label}>{child.label}</div>
                      </Link>
                    </div>
                  )
                })}
              </div>
              
            </div>
          )
        })}
      </div>
    </header>
  );
}
