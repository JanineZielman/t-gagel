/**
 * External Dependencies.
 */
import axios from "axios"
import { useState, useEffect } from "react"

/**
 * Internal Dependencies.
 */
import Layout from "../../src/components/layout"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import { getPosts } from "../../src/utils/blog"
import NewsGrid from "../../src/components/NewsGrid"
import Toggle from "../../src/components/Bits/Toggle" // Import the Toggle component
import styles from "./news.module.scss"
import HomeButton from "../../src/components/Bits/HomeButton"

/**
 * Blog Component.
 *
 * @param {Object} headerFooter Header Footer Data.
 * @param {Object} postsData Post Data.
 */
const Blog = ({ headerFooter, posts }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const seo = {
    title: "Archive Page",
    description: "Archive Page",
    og_image: [],
    og_site_name: "React WooCommerce Theme",
    robots: {
      index: "index",
      follow: "follow",
    },
  }

  return (
    <Layout headerFooter={headerFooter || {}} seo={seo}>
      <HomeButton />
      <div
        className={`${styles.news} ${isDarkMode ? styles.dark : styles.light}`}
      >
        <h1>Nieuws</h1>
        {/* <Toggle
          label="Dark Mode"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        /> */}
        <NewsGrid posts={posts} />
      </div>
    </Layout>
  )
}

  export default Blog

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const { data: postsData } = await getPosts()


  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      posts: postsData.posts_data.filter(post => post.categories[0].slug == 'actueel') || {},
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
