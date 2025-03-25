import React, { useState, useEffect, useRef } from "react"
import styles from "./Hero.module.scss"
import { useRouter } from "next/router"

import CallToActionButton from "../Bits/CallToActionButton"
import ArchiveButton  from "../Bits/ArchiveButton"

const Hero = ({ gallery = [] }) => {
  const [mediaItems, setMediaItems] = useState([])
  const [currentMedia, setCurrentMedia] = useState(null)
  const videoRef = useRef(null)
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (gallery.length === 0) {
      console.warn("Gallery is empty.")
      return
    }

    // Fetch media details based on IDs
    const fetchMedia = async () => {
      try {
        const responses = await Promise.all(
          gallery.map(async (id) => {
            const res = await fetch(`https://gagel.janinezielman.com/wp-json/wp/v2/media/${id}`) // Adjust this API endpoint
            return res.ok ? await res.json() : null
          })
        )

        console.log(responses)

        const filteredMedia = responses
          .filter((item) => item !== null)
          .map((item) => ({
            id: item.id,
            url: item.source_url, // Assuming the API returns this
            type: item.source_url.endsWith(".mp4") ? "video" : "image",
          }))

        setMediaItems(filteredMedia)
        setCurrentMedia(filteredMedia.length > 0 ? filteredMedia[0].url : null)
      } catch (error) {
        console.error("Error fetching media:", error)
      }
    }

    fetchMedia()
  }, [gallery])

  useEffect(() => {
    if (mediaItems.length === 0) return

    const getRandomMedia = () =>
      mediaItems[Math.floor(Math.random() * mediaItems.length)]?.url || ""

    const setNextMedia = () => {
      setCurrentMedia(getRandomMedia())
    }

    const interval = setInterval(() => {
      setNextMedia()
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [mediaItems])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => {
        setCurrentMedia(
          mediaItems[Math.floor(Math.random() * mediaItems.length)]?.url || ""
        )
      }
    }
  }, [currentMedia, mediaItems])

  const handleArchiveClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push("/archive")
    }, 200)
  }

  if (!currentMedia) {
    return (
      <div className={styles.galleryWrapper}>
        <p>Loading media...</p>
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
          />
        ) : (
          <img src={currentMedia} alt="Gallery item" className={styles.media} />
        )}
      </div>
      <div className={styles.logo}>
        <div className={styles.maskImg}></div>
      </div>
      <div className={styles.homeCTA}>
        <CallToActionButton link={"#"}>Word mede-eigenaar!</CallToActionButton>
      </div>
      <ArchiveButton />
    </div>
  )
}

export default Hero
