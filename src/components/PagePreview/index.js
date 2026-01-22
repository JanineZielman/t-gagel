import styles from "./PagePreview.module.scss"

const PagePreview = ({ page }) => {
  // Get first image from carousel (image_slider) or fallback to featured image or placeholder
  const featuredImage =
    page.acf?.image_slider?.[0]?.image?.url ||
    page._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://picsum.photos/400/300"

  return (
    <a
      className={`${styles.pagePreview}`}
      href={page.link.replace("https://cms.gagel.nl", "")}
    >
      <div>
        <h2 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      </div>
      <div>
        <div className={styles.imgWrapper}>
          <img src={featuredImage} alt={page.title.rendered} />
        </div>
      </div>
    </a>
  )
}

export default PagePreview
