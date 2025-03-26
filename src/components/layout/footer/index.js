import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import Link from 'next/link';

let cx = classNames.bind(styles);

export default function Footer({ title, menuItems,primaryMenu, footer }) {
	console.log(footer)
  return (
    <footer className={cx('component')}>
			 <div
          className={styles.footerText}
          dangerouslySetInnerHTML={{ __html: footer.sidebarOne }}
        />
			 {/* <div className={styles.menuItems}>
				{footer.footerMenuItems.map((item, i) => {
						return(
							<div className={styles.menuItem}>
								<Link href={item.url} key={i}> 
									<div className={styles.menuItem}>{item.title}</div>
								</Link>
								<div className={styles.children}>
									{item.children.map((child, i) => {
										return(
											<div className={styles.child}>
												<Link href={child.url} key={i}> 
													<div className={styles.subMenuItem}>{child.title}</div>
												</Link>
											</div>
										)
									})}
								</div>
								
							</div>
						)
					})}
				</div> */}
       
        <div className={styles.lenteland}>
          <div className={styles.maskImg}></div>
        </div>
    </footer>
  );
}

