import classNames from "classnames/bind"
import styles from "./Footer.module.scss"
import Link from "next/link"
import Newsletter from "../../Newsletter"
import { useRouter } from "next/router"

let cx = classNames.bind(styles)

export default function Footer({ title, menuItems, primaryMenu, footer }) {
  const router = useRouter();
  return (
    <footer id={`${router.asPath.includes('archive') && 'archiveFooter'}`} className={cx("component")}>
      <div className={styles.footerContent}>
        <div
          className={styles.footerText}
          dangerouslySetInnerHTML={{ __html: footer.sidebarOne }}
        />
        <Newsletter />
      </div>
      <div className={styles.lenteland}>
        <div className={styles.maskImg}></div>
      </div>
      <div
          className={styles.footerText2}
          dangerouslySetInnerHTML={{ __html: footer.sidebarTwo }}
        />
    </footer>
  )
}
