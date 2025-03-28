import classNames from "classnames/bind"
import styles from "./Footer.module.scss"
import Link from "next/link"
import Newsletter from "../../Newsletter"

let cx = classNames.bind(styles)

export default function Footer({ title, menuItems, primaryMenu, footer }) {
  return (
    <footer className={cx("component")}>
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
    </footer>
  )
}
