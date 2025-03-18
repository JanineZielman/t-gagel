import classNames from 'classnames/bind';
import { Container, NavigationMenu } from '../../components';
import styles from './Footer.module.scss';

let cx = classNames.bind(styles);

export default function Footer({ title, menuItems, footer }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cx('component')}>
      <Container>
        <div
          className={styles.footerText}
          dangerouslySetInnerHTML={{ __html: footer }}
        />
        <NavigationMenu menuItems={menuItems} />
        <div className={styles.lenteland}>
          <div className={styles.maskImg}></div>
        </div>
        {/* <p className={cx('copyright')}>{`${title} © ${year}. Powered by WordPress.`}</p> */}
      </Container>
    </footer>
  );
}
