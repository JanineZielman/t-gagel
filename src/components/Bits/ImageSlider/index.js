import { useState, useEffect, useRef } from "react";
import Image from "../../image";
import styles from "./ImageSlider.module.scss";

const ImageSlider = ({ images }) => {
  const totalSlides = images.length;
  const visibleSlides = 3;
  const slideMargin = 10;
  const infiniteImages = [...images.slice(-visibleSlides), ...images, ...images.slice(0, visibleSlides)];
  const [currentIndex, setCurrentIndex] = useState(visibleSlides);
  const sliderRef = useRef(null);
  const isTransitioning = useRef(false);
  
  useEffect(() => {
    if (sliderRef.current && !isTransitioning.current) {
      sliderRef.current.style.transition = "transform 0.3s ease-in-out";
    }
    
    if (currentIndex === infiniteImages.length - visibleSlides) {
      isTransitioning.current = true;
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
        }
        setCurrentIndex(visibleSlides);
        isTransitioning.current = false;
      }, 0);
    } else if (currentIndex === 0) {
      isTransitioning.current = true;
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
        }
        setCurrentIndex(infiniteImages.length - (2 * visibleSlides));
        isTransitioning.current = false;
      }, 0);
    }
  }, [currentIndex, infiniteImages.length, visibleSlides]);

  const nextSlide = () => {
    if (!isTransitioning.current) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning.current) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={styles.slider}
          style={{
            transform: `translateX(calc(-${currentIndex * (100 / visibleSlides)}% + ${slideMargin}px))`,
            display: "flex",
          }}
        >
          {infiniteImages.map((image, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{
                flex: `0 0 calc(${100 / visibleSlides}% - ${slideMargin * 2}px)`,
                margin: `0 ${slideMargin}px`,
              }}
            >
              <Image
                customImageId={image.image}
                altText={image.alt || ""}
                width={image.width || 800}
                height={image.height || 600}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button className={`${styles.navigationButton} ${styles.prev}`} onClick={prevSlide}>
        ‹
      </button>

      <button className={`${styles.navigationButton} ${styles.next}`} onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default ImageSlider;