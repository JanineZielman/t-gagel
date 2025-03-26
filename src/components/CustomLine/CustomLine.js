import React, { useMemo, useEffect, useState } from "react"

const CustomLine = ({
  height = 37,
  strokeColor = "#DCFF90",
  strokeWidth = 2,
}) => {
  const [width, setWidth] = useState(0)
  const [pathData, setPathData] = useState("")

  useEffect(() => {
    const updateWidth = () => {
      const newWidth = window.innerWidth
      if (Math.abs(newWidth - width) > 50) {
        // Only update if width changes significantly
        setWidth(newWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [width])

  useEffect(() => {
    if (width > 0) {
      const points = []
      let x = 0

      while (x < width) {
        const y = Math.random() * height // Random y-coordinate within height
        points.push([x, y])
        x += Math.random() * 300 // Step size for x-coordinate
      }

      // Generate smooth Bézier curves
      const newPathData = points.reduce((path, [x, y], i, arr) => {
        if (i === 0) return `M${x},${y}` // Move to the first point
        const [prevX, prevY] = arr[i - 1]
        const controlX = (prevX + x) / 2 // Control point for smoothness
        return `${path} Q${controlX},${prevY} ${x},${y}`
      }, "")

      setPathData(newPathData)
    }
  }, [width, height])

  if (width === 0 || !pathData) return null // Avoid rendering until width and path data are ready

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CustomLine
