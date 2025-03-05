import { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import * as MENUS from "../constants/menus"
import { BlogInfoFragment } from "../fragments/GeneralSettings"
import {
  ArchiveMenu,
  Header,
  Hero,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../components"
import { getNextStaticProps } from "@faustwp/core"
import { HomeButton } from "../components/Bits/HomeButton"

export default function Page(props) {
  const { data } = useQuery(Page.query, {
    variables: Page.variables(),
  })
  const title = props.title

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings
  const primaryMenu = data?.headerMenuItems?.nodes ?? []
  const footerMenu = data?.footerMenuItems?.nodes ?? []
  const posts = props?.data.posts?.edges ?? []

  const categories = [
    ...new Set(
      posts.map((item) => item.node.categories.edges[0].node.name.toLowerCase())
    ),
  ]

  const [selectedCategories, setSelectedCategories] = useState([])

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    )
  }

  const filteredPosts = posts.filter((item) =>
    selectedCategories.length === 0
      ? true
      : selectedCategories.includes(
          item.node.categories.edges[0].node.name.toLowerCase()
        )
  )

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <HomeButton />
          <ArchiveMenu
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
          />
          <h1>Archief</h1>

          <div className="post-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((item, i) => (
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
                      <img src={item.node.featuredImage?.node.sourceUrl} />
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p>No posts to show, try adjusting your selection.</p>
            )}
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  )
}

Page.query = gql`
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
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
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
  }
`

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  }
}

export function getStaticProps(ctx) {
  return getNextStaticProps(ctx, {
    Page,
    props: { title: "File Page Example" },
  })
}
