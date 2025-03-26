import { HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import { getPage, getPosts } from '../src/utils/blog';

import axios from 'axios';
import Layout from '../src/components/layout';
import Hero from '../src/components/Hero'
import NewsGrid from '../src/components/NewsGrid'
import PostGrid from '../src/components/PostGrid';

export default function Home({ headerFooter, page, posts }) {
	const seo = {
		title: `'t Gagel`,
		description: 'Next JS WooCommerce Theme',
		og_image: [],
		og_site_name: `'t Gagel`,
		robots: {
			index: 'index',
			follow: 'follow',
		},
	}
  console.log(page)
	return (
		<Layout headerFooter={ headerFooter || {} } seo={ seo }>
      <Hero gallery={page.acf.gallery} />
      <div className='home'>
        <NewsGrid posts={posts.slice(0, 4)} />
        <div
          className={"introText"}
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
        <PostGrid
          posts={posts.slice(4, 7)}
          selectedCategories={""}
        />
        <br></br>
        <br></br>
        <br></br>
        <div className="sections">
          {page.acf.sections.map((item, i) => {
            return (
              <div key={i} className={"textSection"}>
                <div
                  dangerouslySetInnerHTML={{ __html: item.text_section }}
                />
                {item.card && (
                  <div className="cards">
                    {item.card.map((cardItem, j) => {
                      return (
                        <div key={j} className="card">
                          {/* {cardItem.image?.node?.mediaItemUrl && (
                            <Image
                              src={cardItem.image.node.mediaItemUrl}
                              alt={cardItem.title}
                              width={500}
                              height={300}
                              loading="lazy"
                            />
                          )} */}
                          <h2>
                            {cardItem.firstname} {cardItem.lastname}
                          </h2>
                          <div className="functionAtFarm">
                            {cardItem.title}
                          </div>
                          {cardItem.email && (
                            <div className="contactWithFarmer">
                              contact met{" "}
                              <a href={`mailto:${cardItem.email}`}>
                                {cardItem.firstname}
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {item.linkpage && (
                  <div className="center">
                    <CallToActionButton
                      link={item.linkpage.url.replace(
                        "https://gagel.janinezielman.com",
                        ""
                      )}
                    >
                      Lees meer
                    </CallToActionButton>
                  </div>
                )}
                <svg
                      width="1191"
                      height="37"
                      viewBox="0 0 1191 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_0_3)">
                        <path
                          d="M1.7742 14.0366C17.1387 14.8281 49.2694 19.557 66.0356 17.1925C78.5259 15.4292 96.7647 8.51611 109.344 4.56864C121.923 0.621175 130.297 0.621175 138.689 1.41267C147.081 2.20417 161.044 5.36014 161.044 5.36014C161.044 5.36014 169.418 12.4636 201.549 22.713C238.221 34.4151 243.455 25.0774 243.455 25.0774C243.455 25.0774 256.034 22.713 275.586 21.13C295.138 19.547 314.707 14.0265 327.268 14.818C339.83 15.6095 362.202 14.0265 381.754 20.3385C401.305 26.6504 432.052 29.0149 432.052 29.0149C432.052 29.0149 467.536 28.1132 496.314 27.4419C529.846 26.6504 567.565 21.9215 582.93 19.557C588.323 18.7254 630.354 10.4798 641.603 10.8806C663.957 11.6721 654.182 19.557 687.696 27.4519C721.211 35.3469 740.78 33.7639 756.145 32.1809C771.509 30.5979 789.73 24.6166 810.63 19.557C839.975 12.4536 861.798 10.6301 869.303 10.8806C893.059 11.6721 911.209 17.984 920.985 20.3485C930.761 22.713 960.106 27.4519 972.668 29.8164C985.229 32.1809 1012.68 38.9437 1024.35 34.5454C1036.93 29.8164 1055.08 19.557 1055.08 19.557C1055.08 19.557 1092.8 11.6721 1112.35 12.4536C1141.61 13.6358 1153.67 19.8175 1157.06 21.9215C1171.02 30.5979 1189.19 32.1809 1189.19 32.1809"
                          stroke="#DCFF90"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_0_3">
                          <rect width="1191" height="37" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
              </div>
            )
          })}
        </div>
      </div>
		</Layout>
	)
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const pageData = await getPage('boerderij-t-gagel');
  const posts = await getPosts();
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			page: pageData[0] ?? {},
      posts: posts?.data.posts_data
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
