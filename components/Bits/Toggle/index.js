import styles from "./Toggle.module.scss"

export default function Toggle({ label, checked, onChange }) {
  return (
    <div>
      <label className={styles.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={`${styles.slider} ${styles.round}`}></span>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  )
}
