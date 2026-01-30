import styles from "./AccommodationGrid.module.scss"
import AccommodationPreview from "../AccommodationPreview"

const AccommodationGrid = ({ pages }) => {
  return (
    <div className={styles.accommodationGrid}>
      {pages.length > 0 &&
        pages.map((page) => <AccommodationPreview key={page.id} page={page} />)}
    </div>
  )
}

export default AccommodationGrid
