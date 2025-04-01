import { useState, useEffect, useRef } from "react";
import Image from "../../image";
import styles from "./ImageSlider.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    centerPadding: '60px',
  };

  return (
    <div className={styles.sliderContainer}>

      <Slider {...settings}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.slide}
            >
              <Image
                customImageId={image.image}
                altText={image.alt || ""}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
          
      </Slider>
    </div>
  );
};

export default ImageSlider;