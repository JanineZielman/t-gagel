import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"
import LeftHeader from "../LeftHeader/LeftHeader"

export default function ArchiveMenu({}) {
  return (
    <div className={styles.menu}>
      <LeftHeader>
        <div>Logo</div>
        <div className={styles.sumMenu}>
          <div className={styles.subMenuTitle}>Categorien</div>
          <div className={styles.toggles}>
            <Toggle />
            <Toggle />
            <Toggle />
          </div>
        </div>
        <div className={styles.sumMenu}>
          <div className={styles.subMenuTitle}>andere dingen</div>
          <div className={styles.toggles}>
            <Toggle />
            <Toggle />
            <Toggle />
          </div>
        </div>
      </LeftHeader>
    </div>
  )
}
