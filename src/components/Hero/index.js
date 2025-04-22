import React, { useState, useEffect, useRef } from "react"
import styles from "./Hero.module.scss"
import { useRouter } from "next/router"

import CallToActionButton from "../Bits/CallToActionButton"
import ArchiveButton from "../Bits/ArchiveButton"

const Hero = ({ gallery = [], cta }) => {
  const [mediaItems, setMediaItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (gallery.length === 0) {
      console.warn("Gallery is empty.")
      return
    }

    const fetchMedia = async () => {
      try {
        const responses = await Promise.all(
          gallery.map(async (id) => {
            const res = await fetch(
              `https://gagel.janinezielman.com/wp-json/wp/v2/media/${id.ID}`
            )
            return res.ok ? await res.json() : null
          })
        )

        const filteredMedia = responses
          .filter((item) => item !== null)
          .map((item) => ({
            id: item.id,
            url: item.source_url,
            type: item.source_url.endsWith(".mp4") ? "video" : "image",
          }))

        setMediaItems(filteredMedia)
        setCurrentIndex(0)
      } catch (error) {
        console.error("Error fetching media:", error)
      }
    }

    fetchMedia()
  }, [gallery])

  const changeMedia = () => {
    if (mediaItems.length < 2) return // nothing to change or only one

    setFade(true)

    setTimeout(() => {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * mediaItems.length)
      } while (nextIndex === currentIndex)

      setCurrentIndex(nextIndex)
      setFade(false)
    }, 300) // match fade duration in CSS
  }

  useEffect(() => {
    const interval = setInterval(changeMedia, 5000)
    return () => clearInterval(interval)
  }, [mediaItems, currentIndex])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => changeMedia()
    }
  }, [currentIndex])

  if (!mediaItems.length) {
    return (
      <div className={`${styles.galleryWrapper} ${styles.loading}`}>
        <div className={styles.gallery}>
          <div className={styles.loadingPlaceholder} />
        </div>
      </div>
    )
  }

  const currentMedia = mediaItems[currentIndex]

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.gallery}>
        {currentMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={currentMedia.url}
            autoPlay
            playsInline
            muted
            loop
            className={`${styles.media} ${fade ? styles.fade : ""}`}
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Gallery item"
            className={`${styles.media} ${fade ? styles.fade : ""}`}
          />
        )}
      </div>
      <div className={styles.logo}>
        <div className={styles.maskImg}></div>
      </div>
      <div className={styles.homeCTA}>
        <CallToActionButton link={cta.link}>{cta.label}</CallToActionButton>
      </div>
      <ArchiveButton />
    </div>
  )
}

export default Hero
