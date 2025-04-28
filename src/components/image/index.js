import Img from "next/image"
import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import cx from "classnames"


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
    customImageId,
    ...rest
  } = props

  const [fetchedSourceUrl, setFetchedSourceUrl] = useState(null)

  useEffect(() => {
    const fetchMedia = async (id) => {
      try {
        const res = await fetch(
          `https://cms.gagel.nl/wp-json/wp/v2/media/${id}`
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
    fetchedSourceUrl || sourceUrl

  if (!finalSourceUrl) {
    return null
  }

  if ("fill" === layout) {
    return (
      <div className={cx("relative", containerClassNames)}>
        <img  src={finalSourceUrl} />
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
  containerClassName: PropTypes.string,
  className: PropTypes.string,
}

Image.defaultProps = {
  altText: "",
  title: "",
  sourceUrl: "",
  containerClassNames: "",
  className: "product__image",
}

export default Image
