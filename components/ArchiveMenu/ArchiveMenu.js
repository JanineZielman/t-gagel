import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"

export default function ArchiveMenu({}) {
  return (
    <div className={styles.menu}>
      <div>logo</div>
      <div className={styles.sumMenu}>
        <div className={styles.subMenuTitle}>Categorien</div>
        <div className={styles.toggles}>
          <Toggle />
          <Toggle />
          <Toggle />
          <Toggle />
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
          <Toggle />
          <Toggle />
          <Toggle />
          <Toggle />
        </div>
      </div>
    </div>
  )
}
