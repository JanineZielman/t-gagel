import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../src/components/layout"
import styles from "../styles/Bedankt.module.scss"
import axios from "axios"
import { HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints"

const Bedankt = ({ headerFooter }) => {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const referrer = document.referrer || "/"
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = referrer
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Layout headerFooter={headerFooter}>
      <div className={styles.bedankt}>
        <h1>Bedankt voor je aanmelding!</h1>
        <p>
          Je wordt over {countdown} seconden teruggestuurd naar de vorige
          pagina.
        </p>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Fetch header/footer data similar to other pages
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
    },
    revalidate: 1,
  }
}

export default Bedankt
