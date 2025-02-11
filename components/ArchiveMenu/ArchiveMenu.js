import Link from "next/link"
import styles from "./ArchiveMenu.module.scss"
import Toggle from "../Bits/Toggle"

export default function ArchiveMenu({}) {
  return (
    <div className={styles.menu}>
      <div>logo</div>
      <div>
        <div>Categorien</div>

        {/* <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label> */}

        <Toggle />
      </div>
    </div>
  )
}
