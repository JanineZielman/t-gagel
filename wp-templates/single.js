import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { gql } from "@apollo/client"
import { useFaustQuery } from "@faustwp/core"
import {
  FeaturedImage,
  Footer,
  Header,
  Main,
  NavigationMenu,
  SEO,
} from "../components"
import * as MENUS from "../constants/menus"
import { BlogInfoFragment } from "../fragments/GeneralSettings"
import { ArchiveButton } from "../components/Bits/ArchiveButton"

const GET_LAYOUT_QUERY = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetLayout(
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
  }
`

const GET_POST_QUERY = gql`
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
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
      ...FeaturedImageFragment
    }
    categories(where: { exclude: "dGVybTox" }) {
      nodes {
        name
      }
    }
  }
`

export default function Component(props) {
  const router = useRouter()
  const { categories: queryCategories } = router.query

  if (props.loading) {
    return <>Loading...</>
  }

  const { post, categories } = useFaustQuery(GET_POST_QUERY)
  const { generalSettings, headerMenuItems, footerMenuItems } =
    useFaustQuery(GET_LAYOUT_QUERY)

  const { title: siteTitle, description: siteDescription } = generalSettings
  const primaryMenu = headerMenuItems?.nodes ?? []
  const footerMenu = footerMenuItems?.nodes ?? []
  const { title, content, featuredImage, date, author } = post ?? {}

  // Read selected categories from URL or default to post category
  const [selectedCategories, setSelectedCategories] = useState(
    queryCategories
      ? queryCategories.split(",")
      : [post.categories.edges[0].node.name.toLowerCase()]
  )

  useEffect(() => {
    if (queryCategories) {
      setSelectedCategories(queryCategories.split(","))
    }
  }, [queryCategories])

  return (
    <>
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <div
          className={`post ${post.categories.edges[0].node.name.toLowerCase()}`}
        >
          <div className="post-wrapper">
            <h1>{title}</h1>
            <h2>{author.node.name}</h2>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>

          {/* Back to Archive button with category filters */}
          {/* <button
          onClick={() =>
            router.push({
              pathname: '/archive',
              query: selectedCategories.length > 0 ? { categories: selectedCategories.join(',') } : {},
            })
          }
        >
          Back to Archive
        </button> */}
          <ArchiveButton />
        </div>
      </Main>
    </>
  )
}

Component.queries = [
  {
    query: GET_LAYOUT_QUERY,
    variables: (seedNode, ctx) => ({
      headerLocation: MENUS.PRIMARY_LOCATION,
      footerLocation: MENUS.FOOTER_LOCATION,
    }),
  },
  {
    query: GET_POST_QUERY,
    variables: ({ databaseId }, ctx) => ({
      databaseId,
      asPreview: ctx?.asPreview,
    }),
  },
]
