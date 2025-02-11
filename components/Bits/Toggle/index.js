import styles from "./Toggle.module.scss"

export default function Toggle() {
  return (
    <div>
      <label className={styles.switch}>
        <input type="checkbox" />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <label className={styles.switch}>
        <input type="checkbox" />
        <span className={`${styles.slider} ${styles.round} ${styles.dark}`}></span>
      </label>
    </div>
  )
}
