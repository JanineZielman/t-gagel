import { HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints"
import { getPage, getPosts } from "../src/utils/blog"

import axios from "axios"
import Layout from "../src/components/layout"
import Hero from "../src/components/Hero"
import NewsGrid from "../src/components/NewsGrid"
import PostGrid from "../src/components/PostGrid"
import Image from "../src/components/image"
import CustomLine from "../src/components/CustomLine/CustomLine"
import CallToActionButton from "../src/components/Bits/CallToActionButton"

export default function Home({ headerFooter, page, posts }) {
  const seo = {
    title: `'t Gagel`,
    description: "Next JS WooCommerce Theme",
    og_image: [],
    og_site_name: `'t Gagel`,
    robots: {
      index: "index",
      follow: "follow",
    },
  }
  console.log(page)
  return (
    <Layout headerFooter={headerFooter || {}} seo={seo}>
      <Hero gallery={page.acf.gallery} />
      <div className="home">
        <NewsGrid posts={posts.slice(0, 4)} />
        <div
          className={"introText"}
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
        <CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
        {/* <PostGrid posts={posts.slice(4, 7)} selectedCategories={""} /> */}
        <br></br>
        <br></br>
        <br></br>
        <div className="sections">
          {page.acf.sections.map((item, i) => {
            console.log(item)
            return (
              <div key={i} className={"textSection"}>
                <div
                  className="text-wrapper"
                  dangerouslySetInnerHTML={{ __html: item.text_section }}
                />
                {item.card && (
                  <div className="cards">
                    {item.card.map((cardItem, j) => {
                      return (
                        <div key={j} className="card">
                          <h3>
                            {cardItem.firstname} {cardItem.lastname}
                          </h3>
                          <Image
                            width={500}
                            height={300}
                            customImageId={cardItem.image}
                          />
                          <div className="text">{cardItem.text}</div>

                          {/* <div className="functionAtFarm">{cardItem.title}</div> */}

                          {/* {cardItem.email && (
                            <div className="contactWithFarmer">
                              contact met{" "}
                              <a href={`mailto:${cardItem.email}`}>
                                {cardItem.firstname}
                              </a>
                            </div>
                          )} */}
                        </div>
                      )
                    })}
                  </div>
                )}
                {item.linkPage && (
                  <div className="center">
                    <CallToActionButton
                      link={item.linkPage.url.replace(
                        "https://gagel.janinezielman.com",
                        ""
                      )}
                    >
                      Lees meer ...
                    </CallToActionButton>
                  </div>
                )}
                <CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
              </div>
            )
          })}
        </div>
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
      posts: posts?.data.posts_data,
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
