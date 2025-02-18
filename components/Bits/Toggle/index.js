import styles from "./Toggle.module.scss";

export default function Toggle() {
  return (
    <div >
      <label className={styles.switch}>
        <input type="checkbox" />
        <span className={`${styles.slider} ${styles.round}`}></span>
        <span className={styles.labelText}>text</span> {/* Moved inside */}
      </label>
    </div>
  );
}
