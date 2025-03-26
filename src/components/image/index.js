import Img from "next/image"
import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { DEFAULT_IMG_URL } from "../../utils/constants/images"

/**
 * Image Component.
 * We don't need to add srcSet, as Next js will generate that.
 * @see https://nextjs.org/docs/api-reference/next/image#other-props
 * @see https://nextjs.org/docs/basic-features/image-optimization#device-sizes
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Image = (props) => {
  const {
    altText,
    title,
    width,
    height,
    sourceUrl,
    className,
    layout,
    objectFit,
    containerClassNames,
    showDefault,
    customImageId,
    ...rest
  } = props

  const [fetchedSourceUrl, setFetchedSourceUrl] = useState(null)

  useEffect(() => {
    const fetchMedia = async (id) => {
      try {
        const res = await fetch(
          `https://gagel.janinezielman.com/wp-json/wp/v2/media/${id}`
        )
        const data = res.ok ? await res.json() : null
        if (data && data.source_url) {
          setFetchedSourceUrl(data.source_url)
        }
      } catch (error) {
        console.error("Error fetching media:", error)
      }
    }

    if (customImageId !== undefined) {
      fetchMedia(customImageId)
    }
  }, [customImageId])

  const finalSourceUrl =
    fetchedSourceUrl || sourceUrl || (showDefault ? DEFAULT_IMG_URL : "")

  if (!finalSourceUrl) {
    return null
  }

  /**
   * If we use layout = fill then, width and height of the image cannot be used.
   * and the image fills on the entire width and the height of its parent container.
   * That's we need to wrap our image in a container and give it a height and width.
   * Notice that in this case, the given height and width is being used for container and not img.
   */
  if ("fill" === layout) {
    const attributes = {
      alt: altText || title,
      src: finalSourceUrl,
      layout: "fill",
      className: cx("object-cover", className),
      loading: "lazy", // Enable lazy loading
      ...rest,
    }

    return (
      <div className={cx("relative", containerClassNames)}>
        <Img {...attributes} />
      </div>
    )
  } else {
    const attributes = {
      alt: altText || title,
      src: finalSourceUrl,
      width: width || "auto",
      height: height || "auto",
      className,
      loading: "lazy", // Enable lazy loading
      ...rest,
    }
    return <Img {...attributes} />
  }
}

Image.propTypes = {
  altText: PropTypes.string,
  title: PropTypes.string,
  sourceUrl: PropTypes.string,
  layout: PropTypes.string,
  showDefault: PropTypes.bool,
  containerClassName: PropTypes.string,
  className: PropTypes.string,
}

Image.defaultProps = {
  altText: "",
  title: "",
  sourceUrl: "",
  showDefault: true,
  containerClassNames: "",
  className: "product__image",
}

export default Image
