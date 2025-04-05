"use client"
import { useEffect, useState, useRef } from "react"
import Layout from "../../src/components/layout" // Import your custom Layout
import styles from "./campingBoeken.module.scss"
import axios from "axios"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import { getPosts } from "../../src/utils/blog"
import HomeButton from "../../src/components/Bits/HomeButton"

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

  return (
    <Layout headerFooter={headerFooter || {}} seo={seo}>
      <HomeButton />
      <div className={styles.container}>
        <h1>Camping Boeken</h1>

        <div>
          <p>
            Je kunt op onze boerderij overnachten! Ervaar regeneratie van
            binnenuit en dompel jezelf onder in een eetbaar landschap. Kies je
            voor je eigen kampeermiddel of logeer je liever in onze luxe
            ingerichte tenten? Vanuit de camping heb je toegang tot een
            binnenruimte met spelletjes, een regeneratieve inspiratie-bieb, een
            wasmachine en de boerderijwinkel vol verse oogst en biologische
            basics.
          </p>
          <p>
            We planten de komende jaren verschillende soorten fruitbomen,
            bessenstruiken, notenbomen, kruiden en eetbare bloemen aan rondom de
            kampeerplekken. Er ontstaan knusse habitats die stuk voor stuk een
            klein paradijsje vormen voor mens en dier. Een bijzondere plek op de
            boerderij, waar het weer wild mag zijn. Het weidse uitzicht zal
            blijven, maar rondom de tenten wordt het smakelijk en beschut.
          </p>
          <p>
            Er lopen mooie wandel- en fietsroutes langs onze boerderij en er is
            een befaamde MTB baan op steenworp afstand. Ook zijn er in de nabije
            omgeving prachtige landhuizen en kastelen, musea en de charmante
            Hanzesteden Lochem en Zutphen..
          </p>
        </div>

        <>
          <tommy-widget
              data-widget="default"
              data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
              data-language="nl"
              data-period="day"
              data-booking-url="/overnachten/reserveren"
          ></tommy-widget>
        </>
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
