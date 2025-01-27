import { useState } from 'react';
import Link from 'next/link';
import { Container, NavigationMenu, SkipNavigationLink } from '../../components';
import styles from './Header.module.scss';


export default function Header({
  title = 'Headless by WP Engine',
  description,
  menuItems
}) {
  const [isNavShown, setIsNavShown] = useState(false);

  return (
    <header className={`${styles.header} ${isNavShown ? styles.show : ''}`}>
      <div className={styles.arrow} onClick={() => setIsNavShown(!isNavShown)}></div>
      <div className={styles.winkel}>
        {menuItems.slice(0,1).map((item, i) => {
          return(
            <Link href={item.path} key={i}> 
              <div className={styles.imgMask} style={{maskImage:`url(/${item.label}.svg)`}}></div>
              <div className={styles.label}>{item.label}</div>
            </Link>
          )
        })}
      </div>
      <div className={styles.menuItems}>
        {menuItems.slice(1).map((item, i) => {
          return(
            <Link href={item.path} key={i}> 
              <div className={styles.imgMask} style={{maskImage:`url(/${item.label}.svg)`}}></div>
              <div className={styles.label}>{item.label}</div>
            </Link>
          )
        })}
      </div>

      {/* <SkipNavigationLink />
        <Container>
          <div className={cx('navbar')}>
            <div className={cx('brand')}>
              <Link legacyBehavior href="/">
                <a className={cx('title')}>{title}</a>
              </Link>
              {description && <p className={cx('description')}>{description}</p>}
            </div>
            <button
              type="button"
              className={cx('nav-toggle')}
              onClick={() => setIsNavShown(!isNavShown)}
              aria-label="Toggle navigation"
              aria-controls={cx('primary-navigation')}
              aria-expanded={isNavShown}
            >
              ☰
            </button>
            <NavigationMenu
              className={cx(['primary-navigation', isNavShown ? 'show' : undefined])}
              menuItems={menuItems}
            />
        </div>
      </Container> */}
    </header>
  );
}
