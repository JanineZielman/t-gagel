import React, { useState, useEffect, useRef } from "react"
import styles from "./Hero.module.scss"
import { CallToActionButton } from "../Bits/CallToActionButton"
import { useRouter } from "next/router"
import { ArchiveButton } from "../Bits/ArchiveButton"

export default function Hero({ gallery = {} }) {
  const mediaItems = gallery?.gallery?.edges || []
  const [currentMedia, setCurrentMedia] = useState(null)
  const videoRef = useRef(null)
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (mediaItems.length === 0) {
      console.warn("Gallery is empty or does not have the expected structure.")
      return
    }

    const getRandomMedia = () =>
      mediaItems[Math.floor(Math.random() * mediaItems.length)]?.node
        ?.mediaItemUrl || ""

    const setNextMedia = () => {
      setCurrentMedia(getRandomMedia())
    }

    setNextMedia() // Set initial media

    const interval = setInterval(() => {
      setNextMedia()
    }, 5000) // Change every 5 seconds (for images)

    return () => clearInterval(interval)
  }, [mediaItems])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => {
        setCurrentMedia(
          mediaItems[Math.floor(Math.random() * mediaItems.length)]?.node
            ?.mediaItemUrl || ""
        )
      }
    }
  }, [currentMedia, mediaItems])

  const handleArchiveClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push("/archive")
    }, 200) // Verlaag naar 500ms om te navigeren voordat de transitie helemaal klaar is
  }

  if (!currentMedia) {
    return (
      <div className={styles.galleryWrapper}>
        <p>No media available to display.</p>
      </div>
    )
  }

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.gallery}>
        {currentMedia.endsWith(".mp4") ? (
          <video
            ref={videoRef}
            src={currentMedia}
            autoPlay
            playsInline
            muted
            loop
            className={styles.media}
            onEnded={() =>
              setCurrentMedia(
                mediaItems[Math.floor(Math.random() * mediaItems.length)]?.node
                  ?.mediaItemUrl || ""
              )
            }
          />
        ) : (
          <img src={currentMedia} alt="Gallery item" className={styles.media} />
        )}
      </div>
      {/* Keeping your logo here */}
      <div className={styles.logo}>
        <div className={styles.maskImg}></div>
      </div>
      <div className={styles.homeCTA}>
        <CallToActionButton link={"#"}>Word mede-eigenaar!</CallToActionButton>
      </div>
      {/* <div
        className={`${styles.archiveButton} ${
          isAnimating ? styles.animate : ""
        }`}
        onClick={handleArchiveClick}
        role="button"
        tabIndex={0}
      >
        <span className={styles.archiveText}>
          Levend <br></br>Archief
        </span>
      </div> */}

<ArchiveButton />

    </div>
  )
}
