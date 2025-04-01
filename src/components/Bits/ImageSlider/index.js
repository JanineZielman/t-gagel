import { useState } from "react"
import Image from "../../image"
import styles from "./ImageSlider.module.scss"

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.sliderContainer}>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className={styles.slide}>
            <Image
              sourceUrl={image.url}
              altText={image.alt || ""}
              width={image.width || 800}
              height={image.height || 600}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        ))}
      </div>

      <button
        className={`${styles.navigationButton} ${styles.prev}`}
        onClick={prevSlide}
      >
        ‹
      </button>

      <button
        className={`${styles.navigationButton} ${styles.next}`}
        onClick={nextSlide}
      >
        ›
      </button>

      <div className={styles.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
