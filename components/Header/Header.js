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
  console.log(menuItems)

  return (
    <header className={styles.header}>
      <div className={styles.arrow}></div>
      <div className={styles.winkel}>
        {menuItems.slice(0,1).map((item, i) => {
          return(
            <div key={i}>
              <Link href={item.path}> 
                {/* {item.label}  */}
                <div className={styles.imgMask} style={{maskImage:`url(/${item.label}.svg)`}}></div>
              </Link>
            </div>
          )
        })}
      </div>
      <div className={styles.menuItems}>
        {menuItems.slice(1).map((item, i) => {
          return(
            <div key={i}>
              <Link href={item.path}> 
                {/* {item.label}  */}
                <div className={styles.imgMask} style={{maskImage:`url(/${item.label}.svg)`}}></div>
              </Link>
            </div>
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
