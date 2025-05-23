import { useState, useEffect, useRef } from "react";
import Image from "../../image";
import styles from "./ImageSlider.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    centerPadding: '60px',
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          adaptiveHeight: true
        }
      },
    ]
  };

  return (
    <div id="slider" className={styles.sliderContainer}>

      <Slider {...settings}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.slide}
            >
              {image.image &&
                <Image
                  sourceUrl={image.image.url}
                  altText={image.alt || ""}
                  layout="fill"
                  objectFit="cover"
                />
              }
              {image.text &&
                <div className={styles.textWrap} dangerouslySetInnerHTML={{ __html: image.text }}></div>
              }
            </div>
          ))}
          
      </Slider>
    </div>
  );
};

export default ImageSlider;