import styles from "./PageGrid.module.scss"
import PagePreview from "../PagePreview"

const PageGrid = ({ pages }) => {
  return (
    <div className={styles.pageGrid}>
      {pages.length > 0 ? (
        pages.map((page) => <PagePreview key={page.id} page={page} />)
      ) : (
        <p>Geen pagina's om te tonen.</p>
      )}
    </div>
  )
}

export default PageGrid
