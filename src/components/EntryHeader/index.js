import className from "classnames/bind"
import styles from "./EntryHeader.module.scss"

let cx = className.bind(styles)

const EntryHeader = ({
  title,
  image,
  date,
  author,
  className,
  accommodationIconUrl,
  showAccommodationIcon,
}) => {
  const hasText = title || date || author

  return (
    <div className={cx(["component", className])}>
      {/* {image && (
        <FeaturedImage
          image={image}
          className={cx('image')}
          priority
        />
      )} */}

      {hasText && (
        <div className={cx("text", { "has-image": image })}>
          {!!title && <h1 dangerouslySetInnerHTML={{ __html: title }} />}
          {showAccommodationIcon && accommodationIconUrl && (
            <div className={cx("accommodationIconWrapper")}>
              <img
                src={accommodationIconUrl}
                alt=""
                className={cx("accommodationIconImg")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EntryHeader
