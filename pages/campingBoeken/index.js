"use client"
import { useEffect } from "react"
import Layout from "../../src/components/layout" // Import your custom Layout
import styles from "./campingBoeken.module.scss"
import axios from "axios"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import { getPosts } from "../../src/utils/blog"

/**
 * Blog Component.
 *
 * @param {Object} headerFooter Header Footer Data.
 * @param {Object} postsData Post Data.
 */

const Component = ({ headerFooter, posts }) => {
  const seo = {
    title: "campingBoeken page",
    description: "Archive Page",
    og_image: [],
    og_site_name: "React WooCommerce Theme",
    robots: {
      index: "index",
      follow: "follow",
    },
  }
  useEffect(() => {
    // Load Tommy widget script
    const script = document.createElement("script")
    script.src =
      "https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <Layout headerFooter={headerFooter || {}} seo={seo}>
      <h1>Camping Boeken</h1>

      <div>
        <p>Boek hier uw kampeerplaats of accommodatie op Camping 't Gagel.</p>
        <p>
          Kies hieronder uw gewenste aankomst- en vertrekdatum en het aantal
          personen.
        </p>
      </div>

      <div className={styles.container}>
        <tommy-widget
          data-widget="mini"
          data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
          data-language="nl"
        />

        <tommy-widget
          data-widget="default"
          data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
          data-language="nl"
          data-period="day"
        ></tommy-widget>
      </div>
    </Layout>
  )
}

export default Component

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const { data: postsData } = await getPosts()

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      posts: postsData.posts_data || {},
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
