import classNames from 'classnames/bind';
import { Container, NavigationMenu } from '../../components';
import styles from './Footer.module.scss';
import { flatListToHierarchical } from '@faustwp/core';
import Link from 'next/link';

let cx = classNames.bind(styles);

export default function Footer({ title, menuItems,primaryMenu, footer }) {
  const year = new Date().getFullYear();

  const hierarchicalMenuItems = flatListToHierarchical(primaryMenu);

  return (
    <footer className={cx('component')}>
      {/* <Container> */}
      <div className={styles.menuItems}>
      {hierarchicalMenuItems.map((item, i) => {
          return(
            <div className={styles.menuItem}>
              <Link href={item.path} key={i}> 
                <div className={styles.menuItem}>{item.label}</div>
              </Link>
              <div className={styles.children}>
                {item.children.map((child, i) => {
                  return(
                    <div className={styles.child}>
                      <Link href={child.path} key={i}> 
                        <div className={styles.subMenuItem}>{child.label}</div>
                      </Link>
                    </div>
                  )
                })}
              </div>
              
            </div>
          )
        })}
      </div>
        <div
          className={styles.footerText}
          dangerouslySetInnerHTML={{ __html: footer }}
        />
        {/* <NavigationMenu menuItems={menuItems} /> */}
        <div className={styles.lenteland}>
          <div className={styles.maskImg}></div>
        </div>
        {/* <p className={cx('copyright')}>{`${title} © ${year}. Powered by WordPress.`}</p> */}
      {/* </Container> */}
    </footer>
  );
}

