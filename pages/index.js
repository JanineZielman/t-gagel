import { HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints"
import { getPage, getPosts } from "../src/utils/blog"
import { fixImageSizes } from "../src/utils/fixImageSizes"

import axios from "axios"
import Layout from "../src/components/layout"
import Hero from "../src/components/Hero"
import NewsGrid from "../src/components/NewsGrid"

import CustomLine from "../src/components/CustomLine/CustomLine"
import CallToActionButton from "../src/components/Bits/CallToActionButton"
import ImageSlider from "../src/components/Bits/ImageSlider"
import Sections from "../src/components/Sections"
import CookieBar from "../src/components/CookieBar"
import ContactForm from "../src/components/ContactForm/"

export default function Home({ headerFooter, page, posts }) {
  return (
    <Layout headerFooter={headerFooter || {}} seo={page?.yoast_head_json ?? {}}>
      {/* <CookieBar /> */}
      <Hero gallery={page.acf.gallery} cta={page.acf} />
      <div className="home">
        <NewsGrid posts={posts.slice(0, 4)} />
        <div className="center">
          <CallToActionButton link="/nieuws">Lees meer ...</CallToActionButton>
        </div>
        {page.content.rendered.length > 0 && (
          <>
            <div
              className={"introText"}
              dangerouslySetInnerHTML={{
                __html: fixImageSizes(page.content.rendered),
              }}
            />
            <CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
          </>
        )}
        {page.acf.image_slider?.length > 0 && (
          <>
            <ImageSlider images={page.acf.image_slider} />
            <CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
          </>
        )}

        {/* <PostGrid posts={posts.slice(4, 7)} selectedCategories={""} /> */}
        <br></br>
        <br></br>
        <br></br>
        <Sections sections={page.acf.sections} />
        <ContactForm
          backgroundColor="var(--light-green)"
          textColor="var(--boeren-green)"
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const pageData = await getPage("boerderij-t-gagel")
  const posts = await getPosts()

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      page: pageData[0] ?? {},
      posts:
        posts?.data.posts_data.filter(
          (post) => post.categories[0].slug == "actueel",
        ) || {},
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
