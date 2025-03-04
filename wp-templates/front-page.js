import { useQuery, gql } from "@apollo/client"
import * as MENUS from "../constants/menus"
import { BlogInfoFragment } from "../fragments/GeneralSettings"
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
  LeftHeader,
} from "../components"
import { CallToActionButton } from "../components/Bits/CallToActionButton"
import Image from "next/image"

export default function Component() {
  const { data, loading, error } = useQuery(Component.query, {
    variables: Component.variables(),
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings || {}
  const primaryMenu = data?.headerMenuItems?.nodes ?? []
  const footerMenu = data?.footerMenuItems?.nodes ?? []
  const posts = data?.posts?.edges ?? []

  console.log(data)

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <LeftHeader
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <Hero gallery={data?.page?.homepageGallery} />
          <div className="home">
            <div
              className={"introText"}
              dangerouslySetInnerHTML={{ __html: data?.page?.content }}
            />
            <div className="post-grid">
              {posts.slice(0, 3).map((item, i) => {
                return (
                  <a
                    key={i}
                    className={`post-item ${item.node.categories.edges[0].node.name.toLowerCase()}`}
                    href={`/posts/${item.node.slug}`}
                  >
                    <div>
                      <span className="category">
                        {item.node.categories.edges[0].node.name}
                      </span>
                      <h2>{item.node.title}</h2>
                    </div>
                    <div>
                      <p>{item.node.author.node.name}</p>
                      <div className="img-wrapper">
                        <Image
                          src={item.node.featuredImage?.node.sourceUrl}
                          alt={item.node.title}
                          width={500}
                          height={300}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </a>
                )
              })}
              <CallToActionButton className="center" link="/archive">
                Archief
              </CallToActionButton>
            </div>

            <div className="sections">
              {data?.page?.textSection?.sections.map((item, i) => {
                return (
                  <div key={i} className={"textSection"}>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.textSection }}
                    />
                    {item.card && (
                      <div className="cards">
                        {item.card.map((cardItem, j) => {
                            return (
                            <div key={j} className="card">
                              {cardItem.image?.node?.mediaItemUrl && (
                              <Image
                                src={cardItem.image.node.mediaItemUrl}
                                alt={cardItem.title}
                                width={500}
                                height={300}
                                loading="lazy"
                              />
                              )}
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
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={footerMenu}
        footer={data?.menu?.footer?.footer}
      />
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: 50
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    page(id: "/boerderij-t-gagel/", idType: URI) {
      id
      content
      homepageGallery {
        gallery {
          edges {
            node {
              mediaItemUrl
            }
          }
        }
      }
      textSection {
        sections {
          textSection
          linkpage {
            target
            title
            url
          }
          card {
            title
            firstname
            lastname
            email
            image {
              node {
                mediaItemUrl
              }
            }
          }
        }
      }
    }
    posts {
      edges {
        node {
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
            }
          }
          categories {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
    menu(id: "footer", idType: LOCATION) {
      id
      footer {
        footer
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  }
}
