import styles from "./AccommodationPreview.module.scss"
import React, { useEffect, useState } from "react"

const AccommodationPreview = ({ page }) => {
  const [width, setWidth] = useState(0)
  const [pathData, setPathData] = useState("")

  useEffect(() => {
    const updateWidth = () => {
      // Get the width of the accommodation item container
      const container = document.querySelector(
        `.${styles.accommodationPreview}`,
      )
      if (container) {
        setWidth(container.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    if (width > 0) {
      const height = 37
      const points = []
      let x = 0

      while (x < width) {
        const y = Math.random() * height
        points.push([x, y])
        x += Math.random() * 300
      }

      points.push([width, height / 2])

      const newPathData = points.reduce((path, [x, y], i, arr) => {
        if (i === 0) return `M${x},${y}`
        const [prevX, prevY] = arr[i - 1]
        const controlX = (prevX + x) / 2
        return `${path} Q${controlX},${prevY} ${x},${y}`
      }, "")

      setPathData(newPathData)
    }
  }, [width])

  return (
    <a
      className={`${styles.accommodationPreview}`}
      href={page.link.replace("https://cms.gagel.nl", "")}
    >
      <div className={styles.lineContainer}>
        {width > 0 && pathData && (
          <svg
            width="100%"
            height={37}
            viewBox={`0 0 ${width} 37`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={pathData}
              stroke="#DCFF90"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div
            className={styles.icon}
            style={{
              maskImage: "url(/overnachten.svg)",
            }}
          ></div>
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      </div>
    </a>
  )
}

export default AccommodationPreview
