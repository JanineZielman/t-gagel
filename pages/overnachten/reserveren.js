"use client"
import { useEffect, useState } from "react"
import Layout from "../../src/components/layout"
import styles from "./campingBoeken.module.scss"
import axios from "axios"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import HomeButton from "../../src/components/Bits/HomeButton"

const ReserverenPage = ({ headerFooter }) => {
  const [isWidgetLoading, setIsWidgetLoading] = useState(true)

  const seo = {
    title: "Camping Reserveren - 't Gagel",
    description: "Boek direct uw verblijf bij Gemeenschapsboerderij 't Gagel",
    og_image: [],
    og_site_name: "'t Gagel Camping Reservering",
    robots: {
      index: "index",
      follow: "follow",
    },
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://api.tommybookingsupport.com/widgets/js/widget.js"
    // script.async = true
    script.type = "text/javascript"

    document.body.appendChild(script)
  }, [])

  return (
    <Layout headerFooter={headerFooter || {}} seo={seo}>
      <HomeButton />
      <div className={styles.container}>
        <h1>Reserveren</h1>

        <div
          id="TommyBookingSupport"
          data-widget="boeken"
          data-apikey="6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
          data-account="GagelLochem"
          data-language="nl"
          data-country="nl"
        ></div>
      </div>
    </Layout>
  )
}

export default ReserverenPage

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
    },
    revalidate: 1,
  }
}
